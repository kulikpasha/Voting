import {$host} from './index'

export const gAFQ_id = async(question_id) => {
    try {
        const {data} = await $host.get(`api/answer/1`)
        console.log(data)
        return data
    } catch (error) {
        console.error("Ошибка при получении опросов:", error);
		throw error;
    }
}