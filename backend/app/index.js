require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const router = require("./routes/index");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { User, Poll, Question, Answer, Vote, Active_poll } = require("./models");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 5000;

const app = express();
app.use("/", router);
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

// Обработка ошибок
app.use(errorHandler);

const initializeData = async () => {
	try {
		// Заполнение таблицы User
		const usersCount = await User.count();
		if (usersCount === 0) {
			const usersToInsert = [
				{
					user_name: "Sergei",
					email: "user1@example.com",
					password: await bcrypt.hash("password1", 5),
				},
				{
					user_name: "Pasha",
					email: "user2@example.com",
					password: await bcrypt.hash("password2", 5),
				},
				{
					user_name: "Oleg",
					email: "user3@example.com",
					password: await bcrypt.hash("password3", 5),
				},
			];

			const createdUsers = await User.bulkCreate(usersToInsert);
		}

		// заполенние таблицы Poll
		const pollsCount = await Poll.count();
		if (pollsCount === 0) {
			const createdUsers = await User.findAll(); // Получаем всех пользователей

			const pollsToInsert = [
				{
					user_id: createdUsers[0].id, // Привязываем пользователя к опросу
					user_name: createdUsers[0].user_name,
					title: "Голосование за Культурную столицу 2026",
					description: `Конкурс «Культурная столица года» предоставляет регионам страны уникальную возможность ярко представить на федеральном уровне свой социально-экономический потенциал, обеспечить создание условий для роста инвестиционной и туристической привлекательности.`,
					isOpen: true,
				},
				{
					user_id: createdUsers[1].id,
					user_name: createdUsers[1].user_name,
					title: "Оценка удовлетворенности внешних клиентов (граждан) рассмотрением обращений и выполнением запросов Федеральной службой по надзору в сфере здравоохранения",
					description: `Данный опрос проводится с целью получения Росздравнадзором обратной связи от граждан об удовлетворенности рассмотрением обращений и выполнением запросов. По одному обращению необходимо принимать участие в опросе один раз.`,
					isOpen: false,
				},
				{
					user_id: createdUsers[2].id,
					user_name: createdUsers[2].user_name,
					title: "Оценка удовлетворенности внешних клиентов доступом к информации о деятельности Росздравнадзора",
					description: `Данный опрос проводится с целью получения обратной связи от граждан и организаций об удовлетворенности доступом к информации о деятельности Росздравнадзора`,
					isOpen: false,
				},
			];

			const createdPolls = await Poll.bulkCreate(pollsToInsert);
		}

		// заполенние таблицы Question
		const questionsCount = await Question.count();
		if (questionsCount === 0) {
			const polls = await Poll.findAll(); // Получаем все опросы

			const questionsToInsert = [
				{
					poll_id: polls[0].id, // Привязываем вопрос к опросу
					question_text:
						"Как вы оцениваете культурные мероприятия в вашем регионе?",
				},
				{
					poll_id: polls[0].id,
					question_text: "test1",
				},
				{
					poll_id: polls[0].id,
					question_text: "test2",
				},
				{
					poll_id: polls[0].id,
					question_text: "test3",
				},
				{
					poll_id: polls[0].id,
					question_text: "test4",
				},
				{
					poll_id: polls[1].id,
					question_text:
						"Как вы оцениваете работу Федеральной службы по надзору в сфере здравоохранения?",
				},
				{
					poll_id: polls[2].id,
					question_text:
						"Как вы оцениваете доступ к информации о деятельности Росздравнадзора?",
				},
				{
					id: 100,
					poll_id: null,
					question_text: "Данный опрос завершен",
				},
			];

			const createdQuestions = await Question.bulkCreate(
				questionsToInsert
			);
		}

		// заполенние таблицы Active_poll
		const activePollsToInsert = [
			{
				poll_id: 1,
				question_id: null,
			},
			{
				poll_id: 2,
				question_id: null,
			},
			{
				poll_id: 3,
				question_id: null,
			},
		];

		const createdActivePolls = await Active_poll.bulkCreate(
			activePollsToInsert
		);

		// заполенние таблицы Answer
		const answersCount = await Answer.count();
		if (answersCount === 0) {
			const questions = await Question.findAll(); // Получаем все вопросы

			const answersToInsert = [
				{
					poll_id: questions[0].poll_id,
					question_id: questions[0].id, // Привязываем ответ к вопросу
					answer: "Отлично",
				},
				{
					poll_id: questions[0].poll_id,
					question_id: questions[0].id,
					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[0].poll_id,
					question_id: questions[0].id,
					answer: "Неудовлетворительно",
				},
				{
					poll_id: questions[1].poll_id,
					question_id: questions[1].id,
					answer: "Отлично",
				},
				{
					poll_id: questions[1].poll_id,
					question_id: questions[1].id,
					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[1].poll_id,
					question_id: questions[1].id,
					answer: "Неудовлетворительно",
				},
				{
					poll_id: questions[2].poll_id,
					question_id: questions[2].id,
					answer: "Отлично",
				},
				{
					poll_id: questions[2].poll_id,
					question_id: questions[2].id,
					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[2].poll_id,
					question_id: questions[2].id,
					answer: "Неудовлетворительно",
				},
				{
					poll_id: questions[3].poll_id,
					question_id: questions[3].id, // Привязываем ответ к вопросу
					answer: "Отлично",
				},
				{
					poll_id: questions[3].poll_id,
					question_id: questions[3].id,
					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[3].poll_id,
					question_id: questions[3].id,
					answer: "Неудовлетворительно",
				},
				{
					poll_id: questions[4].poll_id,
					question_id: questions[4].id,
					answer: "Отлично",
				},
				{
					poll_id: questions[4].poll_id,
					question_id: questions[4].id,
					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[4].poll_id,
					question_id: questions[4].id,
					answer: "Неудовлетворительно",
				},
				{
					poll_id: questions[5].poll_id,
					question_id: questions[5].id,
					answer: "Отлично",
				},
				{
					poll_id: questions[5].poll_id,
					question_id: questions[5].id,

					answer: "Удовлетворительно",
				},
				{
					poll_id: questions[6].poll_id,
					question_id: questions[6].id,
					answer: "Неудовлетворительно",
				},
			];

			const createdAnswers = await Answer.bulkCreate(answersToInsert);
		}

		// заполенние таблицы Vote
		// const votesCount = await Vote.count();
		// if (votesCount === 0) {
		//   const answers = await Answer.findAll(); // Получаем все ответы

		//   const votesToInsert = [
		//     {
		//       // user_id: users[0].id, // Привязываем пользователя к голосованию
		//       answer_id: answers[0].id, // Привязываем ответ к голосованию
		//       question_id: answers[0].question_id,
		//       poll_id: answers[0].poll_id,
		//     },
		//     {
		//       // user_id: users[1].id,
		//       answer_id: answers[1].id,
		//       question_id: answers[1].question_id,
		//       poll_id: answers[1].poll_id,
		//     },
		//     {
		//       // user_id: users[2].id,
		//       answer_id: answers[2].id,
		//       question_id: answers[2].question_id,
		//       poll_id: answers[2].poll_id,
		//     },
		//     {
		//       // user_id: users[0].id,
		//       answer_id: answers[3].id,
		//       question_id: answers[3].question_id,
		//       poll_id: answers[3].poll_id,
		//     },
		//     {
		//       // user_id: users[1].id,
		//       answer_id: answers[4].id,
		//       question_id: answers[4].question_id,
		//       poll_id: answers[4].poll_id,
		//     },
		//     {
		//       // user_id: users[2].id,
		//       answer_id: answers[5].id,
		//       question_id: answers[5].question_id,
		//       poll_id: answers[5].poll_id,
		//     },
		//     {
		//       // user_id: users[0].id,
		//       answer_id: answers[6].id,
		//       question_id: answers[6].question_id,
		//       poll_id: answers[6].poll_id,
		//     },
		//     {
		//       // user_id: users[1].id,
		//       answer_id: answers[7].id,
		//       question_id: answers[7].question_id,
		//       poll_id: answers[7].poll_id,
		//     },
		//     {
		//       // user_id: users[2].id,
		//       answer_id: answers[8].id,
		//       question_id: answers[8].question_id,
		//       poll_id: answers[8].poll_id,
		//     },
		//   ];

		//   const createdVotes = await Vote.bulkCreate(votesToInsert);
		// }
	} catch (error) {
		console.error("Error initializing data:", error);
	}
};

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		// Инициализация тестовых данных
		await initializeData();

		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	} catch (e) {
		console.log(e);
	}
};

start();
