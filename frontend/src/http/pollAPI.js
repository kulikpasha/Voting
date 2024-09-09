import { $host } from "./index";

export const fetchPolls = async () => {
	try {
		const { data } = await $host.get("api/poll");
		return data;
	} catch (error) {
		console.error("Ошибка при получении опросов:", error);
		throw error;
	}
};

export const fetchOnePoll = async (id) => {
	const { data } = await $host.get("api/poll/" + id);
	return data;
};

export const deletePoll = async (id) => {
	await $host.delete('api/poll/' + id)
}

export const getSinglePollQuestions = async(poll_id) => {
	const {data} = await $host.get('api/question/all/' + poll_id)
	return data
}