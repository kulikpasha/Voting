import { $host } from "./index";

// Вот он, лонг поллинг

export const doLongPolling = async (pollId) => {
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
		const { data } = await $host.get(
			`api/active_poll/one?poll_id=${pollId}`
		);
		return data;
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

export const createQuestion = async(poll_id, question_text) => {
	try {
		const response = await $host.post('api/question/', {
			poll_id,
			question_text
		})
	
		console.log('Вопрос создан')
		return response
	} catch (error) {
		console.log('Ошибка при создании вопроса: ' , error)
	}
}

export const deleteQuestion = async(question_id) => {
	try {
		const response = await $host.delete(`api/question/${question_id}`)
		
		console.log('Вопрос удален')
		return
	} catch (error) {
		console.log(error)
	}
}

export const editQuestion = async(poll_id, questions) => {
    //console.log('Отправляемые данные:', questions); // Добавьте это для проверки данных

    try {
        const response = await $host.post(`api/question/${poll_id}`, {
            questions
        });

        //console.log('Сохранено');
        return response.data;
    } catch (error) {
        console.error('Ошибка при попытке сохранить вопрос: ', error.response || error.message);
    }
}