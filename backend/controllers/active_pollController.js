const { Active_poll, Poll, Question, Answer } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class Active_pollController {
	async create(req, res) {
		const { poll_id, question_id } = req.body;
		const active_poll = await Active_poll.create({ poll_id, question_id });
		return res.json(active_poll);
	}

	async getAll(req, res) {
		const active = await Active_poll.findAll();
		return res.json(active);
	}

	async getOne(req, res, next) {
		const { id, poll_id } = req.query;
	
		if (!id && !poll_id) {
			return next(ApiError.badRequest("Необходимо указать id или poll_id"));
		}
	
		try {
			let active_poll;
	
			if (id) {
				active_poll = await Active_poll.findOne({
					where: { id },
					include: [{
						model: Question,
						include: [Answer] // Включаем варианты ответов
					}]
				});
			} else if (poll_id) {
				active_poll = await Active_poll.findOne({
					where: { poll_id },
					include: [{
						model: Question,
						include: [Answer] // Включаем варианты ответов
					}]
				});
			}
	
			if (!active_poll) {
				return next(ApiError.notFound("Активный опрос не найден"));
			}
	
			// Формируем ответ
			const response = {
				id: active_poll.id,
				poll_id: active_poll.poll_id,
				question_text: active_poll.Question.question_text, // Текст вопроса
				answers: active_poll.Question.Answers.map(answer => answer.answer) // Варианты ответов
			};
	
			return res.json(response);
		} catch (e) {
			return next(ApiError.internal("Ошибка при получении активного опроса"));
		}
	}

	async delete(req, res, next) {
		const { id } = req.params;

		try {
			await Active_poll.destroy({ where: { id } });
			return res.json({ message: "Активный опрос удален" });
		} catch (e) {
			return next(
				ApiError.internal("Ошибка при удалении активного опроса")
			);
		}
	}

	async nextQuestion(req, res, next) {
		const { poll_id } = req.body;

		let isNull = false;

		if (!poll_id) {
			return next(ApiError.badRequest("poll_id обязателен"));
		}

		try {
			const active_poll = await Active_poll.findOne({
				where: { poll_id },
			});

			if (!active_poll) {
				return next(ApiError.notFound("Активный опрос не найден"));
			}

			let current_question_id = active_poll.question_id;

			if (current_question_id === null) {
				isNull = true;
				const first_question = await Question.findOne({
					where: { poll_id },
					order: [["id", "ASC"]],
				});

				if (!first_question) {
					return next(ApiError.notFound("Первый вопрос не найден"));
				}

				current_question_id = first_question.id;

				await Active_poll.update(
					{ question_id: current_question_id },
					{ where: { poll_id } }
				);
			}

			let next_question;
			let new_question_id;
			let question_text;
			let answers = [];

			if (isNull) {
				next_question = await Question.findOne({
					where: { poll_id, id: current_question_id },
				});
			} else {
				next_question = await Question.findOne({
					where: {
						poll_id,
						id: { [Op.gt]: current_question_id },
					},
					order: [["id", "ASC"]],
				});
			}

			if (!next_question) {
				new_question_id = 100;
				question_text = "Данный опрос завершен";
			} else {
				new_question_id = next_question.id;
				question_text = next_question.question_text;

				const answer_options = await Answer.findAll({
					where: { question_id: new_question_id },
				});

				answers = answer_options.map((answer) => (answer.answer));
			}

			await Active_poll.update(
				{ question_id: new_question_id },
				{ where: { poll_id } }
			);

			return res.json({ new_question_id, question_text, answers });
		} catch (e) {
			return next(
				ApiError.internal("Ошибка при переходе к следующему вопросу")
			);
		}
	}

	async longPoll(req, res, next) {
		const { poll_id } = req.params;

		if (!poll_id) {
			return next(ApiError.badRequest("poll_id обязателен"));
		}

		try {
			let current_question_id;
			const checkForUpdates = async () => {
				const active_poll = await Active_poll.findOne({
					where: { poll_id },
				});

				if (!active_poll) {
					return next(ApiError.notFound("Активный опрос не найден"));
				}

				if (current_question_id !== active_poll.question_id) {
					const updated_question = await Question.findOne({
						where: { id: active_poll.question_id },
						include: [
							{
								model: Answer,
								attributes: ["id", "answer"],
							},
						],
					});

					if (!updated_question) {
						return next(ApiError.notFound("Вопрос не найден"));
					}

					const response = {
						question_id: updated_question.id,
						question_text: updated_question.question_text,
						answers: updated_question.Answers.map((answer) => ({
							id: answer.id,
							text: answer.answer,
						})),
					};

					return res.json(response);
				}

				setTimeout(checkForUpdates, 1000);
			};

			const initialPoll = await Active_poll.findOne({
				where: { poll_id },
			});

			if (!initialPoll) {
				return next(ApiError.notFound("Активный опрос не найден"));
			}

			current_question_id = initialPoll.question_id;

			checkForUpdates();
		} catch (e) {
			return next(ApiError.internal("Ошибка при проверке изменений"));
		}
	}
}

module.exports = new Active_pollController();
