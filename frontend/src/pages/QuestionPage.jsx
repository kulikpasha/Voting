import React, { useState, useEffect } from 'react';
import { doLongPolling, submitAnswer } from '../http/questionAPI';
import '../components/QuestionPage.css';
import { useParams } from "react-router-dom";

function QuestionPage() {
	const [question, setQuestion] = useState({ text: "", answers: [] });
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();

	useEffect(() => {
		let isMounted = true;

		const fetchQuestion = async () => {
			if (!isMounted) return;

			try {
				const questionData = await doLongPolling(id);
				if (questionData && isMounted) {
					setQuestion({
						question_text: questionData.question_text,
						answers: questionData.answers,
					});
					setIsLoading(false);
					setSelectedAnswer(null);
					setIsSubmitted(false);
					fetchQuestion();
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchQuestion();

		return () => {
			isMounted = false;
		};
	}, [id]);

	const handleAnswerChange = (event) => {
		setSelectedAnswer(event.target.value);
	};

	const handleSubmit = async () => {
		if (selectedAnswer) {
			try {

				await submitAnswer(id, question.question_id, selectedAnswer);
				console.log(`Ответ ${selectedAnswer} отправлен.`);
				setIsSubmitted(true);
			} catch (error) {
				console.error("Ошибка при отправке ответа:", error);
			}
		}
	};

	if (isLoading) {
		return <div className="loading-message">Ожидайте начала голосования!</div>;
	}

	return (
		<div className="question-page">
			<h2 className="question-text">{question.question_text}</h2>
			<form className="answers-form" onSubmit={(e) => e.preventDefault()}>
				{question.answers.map((answer) => (
					<div key={answer.id} className="answer">
						<input
							type="radio"
							name="answer"
							value={answer.id}
							id={`answer-${answer.id}`}
							onChange={handleAnswerChange}
							checked={selectedAnswer === answer.id.toString()} />
						<label htmlFor={`answer-${answer.id}`}>{answer.text}</label>
					</div>
				))}
				<button type="button" onClick={handleSubmit} disabled={isSubmitted || selectedAnswer === null} className="submit-button">
					Отправить
				</button>
			</form>
			{isSubmitted && <p className="submission-message">Ваш голос учтен, ожидайте следующего вопроса.</p>}
		</div>
	);
}

export default QuestionPage;