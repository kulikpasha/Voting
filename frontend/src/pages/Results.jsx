import React, { useState , useEffect } from "react";
import PieChart from '../components/diagrams/pieChart'
import './results/style.css'
import { useParams } from "react-router-dom";
import { get_one, get_poll_questions } from "../http/questionAPI";
import { setCurrentQuestion } from "../http/active_pollAPI";
import { gAFQ_id } from "../http/answerAPI";
import Answer from "./questionsControll/answer";
import { fetchOnePoll } from "../http/pollAPI";

// результаты голосования

// И этим занимаемся

export default function PollResult() {
	const { id } = useParams()
	const [pollInfo, setPollInfo] = useState()
	const [allQuestions, setAllQuestions] = useState()
	const [question, setQuestion] = useState()
	const [answers, setAnswers] = useState()

	const data = {
		labels: ['Йоу', 'Сосал 	', 'Да', 'Green', 'Purple', 'Orange'],
		values: [12, 19, 3, 5, 2, 3],
	};
	
	useEffect(() => {
		const poll = fetchOnePoll(id).then(poll_information => {
			try {
				setPollInfo(poll_information)
			} catch (e) {
				console.log(e)
			}
		})

		const poll_questions = get_poll_questions(id).then(poll_questions => {
			try {
				const response = setCurrentQuestion(id, poll_questions[0].id).then(question => {
					setQuestion(poll_questions[0])
					setAllQuestions(poll_questions)
				})
			} catch (e) {
				console.log(e)
			}
		})
	}, [id])
	
	useEffect(() => {
		if (question) {
			gAFQ_id(question.id, id).then(answers => {
				try {
					setAnswers(answers)
				} catch (e) {
					console.log(e)
				}
			})
		}
	}, [question])

	if (!question || !pollInfo) {
        return <div>Загрузка...</div>; // Можно добавить спиннер или текст "Загрузка..."
    }

	return (
		<div className="overflow_hidden">
			<div className="bgrd_results">

			</div>
			<div className="container" style={{flexDirection: 'column', alignItems: 'center'}}>
				<div className="title_results">
					Результаты голосования <span style={{color: '#fc8b19', fontWeight: 'bold'}}>{pollInfo.title}</span>
				</div>
				<div className="result_container">
					<div className="questions_list">
						{allQuestions.map((question, index) => 
							<div className="questions_list_component" key={question.id}>
								{index+1}
							</div>
						)}
					</div>
					<div className="pie_chart_container">
						<PieChart data={data} />
					</div>
					<div className='questions_container'>
						<div className='image_container'>
							<img src='https://vgif.ru/gifs/146/vgif-ru-19857.webp' height={'100%'} style={{objectFit: 'cover'}}>
								
							</img>
						</div>
						<div className='question_type'>
							<span>Вопрос с выбором ответа</span>
						</div>
						{question && (
						<>
							<div className='question_title_client'>
								<span>{question.question_text}</span>
							</div>
							<div className='answer_list_client'>
								{answers && answers.map((answer, index) =>
									<Answer key={answer.id}
										id={answer.id}
										text={answer.answer}
										index={index} />
								)}
							</div>
						</>
						)}
					</div>	
				</div>
			</div>
		</div>
	);
}
