import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollStatus, nextQuestion } from '../http/questionAPI';
import Button from '../components/Button/Button';
import '../components/PollAdmin.css'

function PollAdmin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [currentQuestion, setCurrentQuestion] = useState({question_text: 0, answers: [1,2,3]});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');


	const handleAction = async () => {
		if (currentQuestion.question_text === "Данный опрос завершен") {
			navigate(`/result/${id}`);
		} else {
			try {
				const data = await nextQuestion(id);
				setCurrentQuestion({
					question_text: data.question_text,
					answers: data.answers,
				});
				
			} catch (error) {
				console.error('Ошибка при переходе к следующему вопросу:', error);
			}
		}
	};


	useEffect(() => {
		setIsLoading(true);
		setError('');

		getPollStatus(id)
			.then(data => {
				setCurrentQuestion(data);
				
				setIsLoading(false);
			})
			.catch(error => {
				console.error(error);
				setError('Ошибка: сервер бэкенда не доступен');
				setIsLoading(false);
			});

	}, []);

	if (isLoading) {
		return <main><p>Загрузка...</p></main>;
	}

	if (error) {
		return <main><p>{error}</p></main>;
	}

	return (
		<div className="pollAdmin">
			<h1 className="header">Управление опросом</h1>
			<div className="questionSection">
				<h2>Текущий вопрос:</h2>
				<h1 className="questionText">{currentQuestion.question_text}</h1>
				
				 
					<ul className="answersList">
						{currentQuestion.answers.map((answer) => (
							<li key={answer.id} className="answerItem">{answer}</li>
						))}
					</ul>
				
			</div>
			<Button onClick={handleAction}>
				{currentQuestion.question_text === "Данный опрос завершен" ? "Посмотреть результаты" : "Следующий вопрос"}
			</Button>
		</div>
	);
}

export default PollAdmin;