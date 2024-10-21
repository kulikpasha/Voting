const { Active_poll, Poll, Question, Answer } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const e = require("cors");

class Active_pollController {
	async create(req, res, next) {
		const { poll_id } = req.body;
		try {
			const all_questions = await Question.findAll({
				where: { poll_id },
				order: [["id", "ASC"]],
			});

			const first_question = all_questions[0].dataValues.id

			console.log("Первый вопрос по мнению сервера : ", first_question)

			const active_poll = await Active_poll.create({ poll_id, question_id: first_question });

			console.log('Созданый актив пол', active_poll)

			return res.json(active_poll);
		} catch (error) {
			try {
				const active_poll = await Active_poll.findOne({where: { poll_id }})
				return res.json(active_poll)
			} catch (error) {
				console.log(error)
			}
		}
	}

	async getAll(req, res) {
		const active = await Active_poll.findAll();
		return res.json(active);
	}

	async getOne(req, res, next) {
		const { poll_id } = req.query;
	
		if (!poll_id) {
			return next(ApiError.badRequest("Необходимо указать id или poll_id"));
		}

		console.log('fqfq')
	
		try {
			const activePoll = await Active_poll.findOne({where: {poll_id}})
			const response = activePoll
	
			return res.json(response);
		} catch (e) {
			console.log(e)
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
		const { poll_id } = req.body

		try {
			 const active_poll = await Active_poll.findOne({
				where: {poll_id}
			})

			const next_question = await Question.findOne({ 
				where: {
					poll_id,
					id: { [Op.gt]: active_poll.question_id }
				},
				order: [["id", "ASC"]]
			})

			if (!next_question) {
				return res.json(null)
			} else {

				console.log('Сейчас будет обновление опроса')
				const respose = await Active_poll.update(
					{question_id: next_question.id},
					{where: {poll_id}}
				)

				console.log('Новые данные опроса - ', respose)

				console.log('Возвращаемые данные - ', next_question)

				return res.json({next_question})
			}
		} catch (error) {
			console.log('Ошибка при переходе к следующему вопросу: ', error)
		}
	}

	async prevQuestion(req, res, next) {
		try{
			const {poll_id} = req.body

			const active_poll = await Active_poll.findOne({
				where: {poll_id}
			})

			const prev_question = await Question.findOne({
				where: {
					poll_id,
					id: { [Op.lt]: active_poll.question_id }
				},
				order: [['id', 'DESC']]
			})

			if (!prev_question) {
				return res.json(null)
			} else {
				const respose = await Active_poll.update(
					{question_id: prev_question.id},
					{where: {poll_id}}
				)

				return res.json({prev_question})
			}
		} catch (error) {
			console.log(error)
		}
	}

	async changePollStatus(req, res) {
		const { poll_id, status } = req.body

		const response = await Active_poll.update({status}, {where: {poll_id}})
		return res.json({message: `Статус опроса ${poll_id} изменен на ${status}`})
	}

	/* 	оставил в памать дедов
	async nextQuestion(req, res, next) {
		const { poll_id } = req.body;

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

			const current_question_id = active_poll.question_id;

			const next_question = await Question.findOne({
				where: {
					poll_id,
					id: { [Op.gt]: current_question_id },
				},
				order: [["id", "ASC"]],
			});

			if (!next_question) {
    			const new_question_id = 1000;
    			const question_text = "Данный опрос завершен";
				const answers = []

    			return res.json({ new_question_id, question_text, answers });
			} else {
				const new_question_id = next_question.id;
				const question_text = next_question.question_text;

				const answer_options = await Answer.findAll({
					where: { question_id: new_question_id },
				});

				const answers = answer_options.map((answer) => (answer.answer));

				await Active_poll.update(
					{ question_id: new_question_id },
					{ where: { poll_id } }
				);
	
				return res.json({ new_question_id, question_text, answers });
			}
		} catch (e) {
			return next(
				ApiError.internal("Ошибка при переходе к следующему вопросу")
			);
		}
	}
		*/

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
