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
			console.log('Создан вопрос: ', questionData)
			return res.json(question);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async delete(req, res, next) {
		try {
			const {id} = req.params

			await Question.destroy({where: {id}})
			return res.json({message: 'Вопрос удален'})
		}	catch (error) {
			console.log(error)
		}
	}

	async getAll(req, res) {
		try {
			const { poll_id } = req.params;

			if (!poll_id) {
				return res.status(400).json({ error: "poll_id не указан" });
			}

			const questions = await Question.findAll({ where: { poll_id } });

			return res.json(questions);
		} catch {
			return undefined
		}
	}

	async getOne(req, res) {
		const { id } = req.params;

		const question = await Question.findOne({ where: { id } });

		return res.json(question);
	}

	async getPollQuestions(req, res) {
		const {poll_id} = req.params
		const questions = await Question.findAll({ where: {poll_id} })

		return res.json(questions)
	}

	async editQuestions(req, res, next) {
		const {poll_id} = req.params
		const {questions} = req.body
/*
		console.log(questions[0].question_text)

		console.log(req.params)

		console.log("Полученные вопросы:", questions);
        console.log("ID голосования:", poll_id);
*/

		try {
			const  existingQuestions = await Question.findAll({where: {poll_id: poll_id}})
			//console.log("Существующие вопросы:", existingQuestions);

			if ( existingQuestions.length === 0 ) {
				//console.log('Вопросов данного голосования не найдено');
				return res.status(404).json({message: 'Вопросов данного голосования не найдено'})
			}
			const updatePromises = questions.map((question) => {
				const { id, question_text } = question;
				//console.log(`Обновление вопроса с ID ${id}: ${question_text}`);
				return Question.update(
					{ question_text },
					{ where: { id, poll_id } }
				);
			});
	
			// Ждем выполнения всех обновлений
			try {
				const updateResults = await Promise.all(updatePromises);
				//console.log('Результаты обновления: ', updateResults);
			} catch (error) {
				console.error('Ошибка при обновлении вопросов: ', error);
			}

			return res.json({message: 'Все вопросы обновлены'})
		}	catch (error) {
			return next(ApiError.internal('Ошибка при обновлении запросов'))
		}
	}
}

module.exports = new QuestionController();
