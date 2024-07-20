const { Question } = require("../models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");

class QuestionController {
	async create(req, res, next) {
		try {
			const { poll_id, question_text } = req.body;

			let fileName = null;

			if (req.files && req.files.img) {
				fileName = uuid.v4() + ".jpg";
				req.files.img.mv(
					path.resolve(__dirname, "..", "static", fileName)
				);
			}

			const questionData = { poll_id, question_text };

			if (fileName) {
				questionData.img = fileName;
			}

			const question = await Question.create(questionData);

			return res.json(question);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res) {
		const { poll_id } = req.query;

		if (!poll_id) {
			return res.status(400).json({ error: "poll_id не указан" });
		}

		const questions = await Question.findAll({ where: { poll_id } });

		if (questions.length === 0) {
			return res
				.status(404)
				.json({ message: "Вопросы по указанному poll_id не найдены" });
		}

		return res.json(questions);
	}

	async getOne(req, res) {
		const { id } = req.params;

		const question = await Question.findOne({ where: { id } });

		return res.json(question);
	}
}

module.exports = new QuestionController();
