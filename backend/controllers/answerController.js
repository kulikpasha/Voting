const { Answer } = require("../models");
const { Question } = require("../models");
const ApiError = require("../error/ApiError");

class AnswerController {
	async create(req, res) {
		const { question_id, answer } = req.body;

		try {
			const question = await Question.findByPk(question_id);

			if (!question) {
				return res.status(404).json({ message: "Question not found" });
			}

			const poll_id = question.poll_id;

			const answer_obj = await Answer.create({
				question_id,
				answer,
				poll_id,
			});
			return res.json(answer_obj);
		} catch (error) {
			return res.status(500).json({ message: "Server error", error });
		}
	}

	async getAll(req, res) {
		const { question_id } = req.params;

		let answers;
		answers = await Answer.findAll({where: {question_id}})
		return res.json(answers);
	}
}

module.exports = new AnswerController();
