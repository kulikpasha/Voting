import { $host } from "./index";

// Вот он, лонг поллинг

export const createActive_Poll = async (pollId) => {
    try {
        const response = await $host.post(`api/active_poll/`, {
			poll_id: pollId
		})

		console.log(response)

        return response.data
    } catch (error) {
        console.log('Ошибка при создании активного опроса')
    }
}

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
		
	}
};

export const updateStatus = async(poll_id, status) => {
	try {
		const { data } = await $host.post('api/active_poll/update', {
			poll_id,
			status
		})

		console.log('Статус обновлен')
	} catch (e) {
		console.log(e)
	}
}

// 	return from back: {question_id:
// 	question_text:
// 	answers: [{id:
// 		text:
// 	}]}

export const nextQuestion = async (poll_id) => {
	try {
		const response = await $host.post('api/active_poll/next', {
			poll_id
		})
		const { next_question } = response.data
		return next_question
	} catch (error) {
		return null
	}
};

export const prevQuestion = async (poll_id) => {
	try {
		const response = await $host.post('api/active_poll/prev', {
			poll_id
		})
		const { prev_question } = response.data
		return prev_question
	} catch (error) {
		return null
	}
}

// Работа с ответами пользователей

export const submitAnswer = async (user_id, answer_id) => {
	try {
		const response = await $host.post("/api/vote", {
			user_id,
			answer_id
		});

		console.log("Ответ успешно сохранен:", response.data);
		return response.data;
	} catch (error) {
		console.error("Ошибка при попытке сохранить ответ:", error);
		throw error;
	}
};