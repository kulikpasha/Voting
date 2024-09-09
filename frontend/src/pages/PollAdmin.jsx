import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollStatus, nextQuestion } from '../http/questionAPI';
import Button from '../components/Button/Button';
import '../components/PollAdmin.css'

// Этим занимаемся

function PollAdmin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [currentQuestion, setCurrentQuestion] = useState(null);

	const fetchCurrentQuestion = async () => {
		try {
			const response = await getPollStatus(id);
			setCurrentQuestion({
				question_text: response.question_text,
				answers: response.answers,
			});
		} catch (error) {
			console.error('Ошибка при получении текущего вопроса:', error);
		}
	};

	const handleAction = async () => {
		if (currentQuestion.question_text === "Данный опрос завершен") {
			navigate(`/result/${id}`);
		} else {
			try {
				const response = await nextQuestion(id);
				setCurrentQuestion({
					question_text: response.question_text,
					answers: response.answers,
				});
			} catch (error) {
				console.error('Ошибка при переходе к следующему вопросу:', error);
			}
		}
	};

	useEffect(() => {
		fetchCurrentQuestion();
	}, [id]);

	if (currentQuestion === null) {
		return <div className="loading">Загрузка текущего вопроса...</div>;
	}

	return (
		<div className="pollAdmin">
			<h1 className="header">Управление опросом</h1>
			<div className="questionSection">
				<h2>Текущий вопрос:</h2>
				<h1 className="questionText">{currentQuestion.question_text}</h1>
				{currentQuestion.answers && (
					<ul className="answersList">
						{currentQuestion.answers.map((answer) => (
							<li key={answer.id} className="answerItem">{answer.text}</li>
						))}
					</ul>
				)}
			</div>
			<Button onClick={handleAction}>
				{currentQuestion.question_text === "Данный опрос завершен" ? "Посмотреть результаты" : "Следующий вопрос"}
			</Button>
		</div>
	);
}

export default PollAdmin;
