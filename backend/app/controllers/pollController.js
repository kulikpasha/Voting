const { Poll, Answer, Question, Vote, Active_poll } = require("../models");
const ApiError = require("../error/ApiError");

class PollController {
	async create(req, res, next) {
		const { user_id, user_name, title, description, isOpen } = req.body;

		try {
			const poll = await Poll.create({
				user_id,
				user_name,
				title,
				description,
				isOpen,
			});

			await Active_poll.create({
				poll_id: poll.id,
				question_id: null,
			});

			return res.json(poll);
		} catch (e) {
			return next(ApiError.internal("Ошибка при создании опроса"));
		}
	}

	async getAll(req, res) {
		const { user_id, title } = req.query;

		let polls;

		if (!user_id && !title) {
			polls = await Poll.findAll();
		}
		if (user_id && !title) {
			polls = await Poll.findAll({ where: { user_id } });
		}
		if (!user_id && title) {
			polls = await Poll.findAll({ where: { title } });
		}
		if (user_id && title) {
			polls = await Poll.findAll({ where: { user_id, title } });
		}
		return res.json(polls);
	}

	async getOne(req, res) {
		const { id } = req.params;

		const poll = await Poll.findOne({ where: { id } });

		return res.json(poll);
	}

	async delete(req, res, next) {
		const { id } = req.params;
		try {
			await Vote.destroy({ where: { poll_id: id } });
			await Answer.destroy({ where: { poll_id: id } });
			const questions = await Question.findAll({
				where: { poll_id: id },
			});

			for (const question of questions) {
				await Vote.destroy({ where: { question_id: question.id } });
				await Answer.destroy({ where: { question_id: question.id } });
			}

			await Question.destroy({ where: { poll_id: id } });
			await Poll.destroy({ where: { id } });

			return res.json({
				message: "Опрос и связанные данные успешно удалены",
			});
		} catch (e) {
			return next(ApiError.internal("Ошибка при удалении опроса"));
		}
	}
}

module.exports = new PollController();
