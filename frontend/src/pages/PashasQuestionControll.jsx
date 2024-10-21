import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollStatus, nextQuestion } from '../http/active_pollAPI';
import Button from '../components/Button/Button';
import '../components/PollAdmin.css'

// страница, где админ переключает вопросы

// Этим занимаемся

function PollAdmin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [currentQuestion, setCurrentQuestion] = useState({question_text: 0, answers: [1,2,3]});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleAction = async () => {
		const data = await nextQuestion(id);
		console.log(data.new_question_id )
		if (data.new_question_id === 1000) {
			console.log('elel')
			setCurrentQuestion({
				question_text: data.question_text,
				answers: data.answers,
			});
			$(document).on('click', 'button', function() {
				navigate(`/result/${id}`);
			})
		} else {
			try {
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
				console.log(data)
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

	console.log(currentQuestion.new_question_id)

	return (
		<div className="pollAdmin">
			<h1 className="header">Управление опросом</h1>
			{currentQuestion.question_text === "Данный опрос завершен" ? (
				<div>
					<span>
						Опрос закончен
					</span>
				</div>
			) : (
				<>
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
				</>
			)}
		</div>
	);
}

export default PollAdmin;