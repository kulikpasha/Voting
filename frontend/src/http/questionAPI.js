import { $host } from "./index";

export const getCurrentQuestion = async (pollId) => {
	try {
		const { data } = await $host.get(`api/active_poll/longpoll/${pollId}`);
		return data;
	} catch (error) {
		console.error("Ошибка при получении актуального вопроса:", error);
		throw error;
	}
};
// return from back: {
// 	question_id:
// 	question_text:
// 	answers: [{id:
// 		text:
// 	}]
// }
export const getPollStatus = async (pollId) => {
	try {
		const response = await $host.get(
			`api/active_poll/one?poll_id=${pollId}`
		);
		console.log("Статус опроса получен", response.data);
		return response.data;
	} catch (error) {
		console.error("Ошибка при попытке получить статус опроса:", error);
		throw error;
	}
};

// 	return from back: {question_id:
// 	question_text:
// 	answers: [{id:
// 		text:
// 	}]}

export const nextQuestion = async (pollId) => {
	try {
		const response = await $host.post("/api/active_poll/next", {
			poll_id: pollId,
		});

		console.log(
			"Переключение на следующий вопрос выполнено успешно:",
			response.data
		);
		return response.data;
	} catch (error) {
		console.error(
			"Ошибка при попытке переключиться на следующий вопрос:",
			error
		);
		throw error;
	}
};
// 	return from back: {question_id:
// 	question_text:
// 	answers: [{id:
// 		text:
// 	}]}

export const submitAnswer = async (pollId, questionId, answerId) => {
	try {
		const response = await $host.post("/api/vote", {
			poll_id: pollId,
			question_id: questionId,
			answer_id: answerId,
		});

		console.log("Ответ успешно сохранен:", response.data);
		return response.data;
	} catch (error) {
		console.error("Ошибка при попытке сохранить ответ:", error);
		throw error;
	}
};
