const { Vote } = require("../models");
const { Answer } = require("../models");
const ApiError = require("../error/ApiError");

class VoteController {
	async create(req, res) {
		const { user_id, answer_id } = req.body;
		try {
			const answer = await Answer.findByPk(answer_id);

			if (!answer) {
				return res.status(404).json({ message: "Answer not found" });
			}

			const question_id = answer.question_id;
			const poll_id = answer.poll_id;
			const vote = await Vote.create({
				user_id,
				answer_id,
				question_id,
				poll_id,
			});

			return res.json(vote);
		} catch (error) {
			return res.status(500).json({ message: "Server error", error });
		}
	}

	async getAll(req, res) {
		const { question_id, poll_id, answer_id, user_id } = req.query;
		let where = {};

		if (question_id) where.question_id = question_id;
		if (poll_id) where.poll_id = poll_id;
		if (answer_id) where.id = answer_id;
		if (user_id) where.user_id = user_id;

		const vote = await Vote.findAll({ where });

		return res.json(vote);
	}
}

module.exports = new VoteController();
