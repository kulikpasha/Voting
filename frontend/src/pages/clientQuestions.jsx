import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doLongPolling, getPollStatus, submitAnswer, updateStatus } from '../http/active_pollAPI';
import '../components/clientQuestions/QuestionPage.css';
import '../components/clientQuestions/index.js'
import { useParams } from "react-router-dom";
import { useWebSocket } from '../WebSocket/WebSocketContext';
import { get_one } from '../http/questionAPI';
import { gAFQ_id } from '../http/answerAPI';
import Answer from '../components/clientQuestions/answer'

// активный опрос на стороне клиента

function QuestionPage() {
	const [question, setQuestion] = useState();
	const [answers, setAnswers] = useState()
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [pollState, setPollState] = useState('waiting')
	const [question_id, setQuestion_id] = useState()
	const userId = 1;
	
	const { id } = useParams();

	const { clientSocketRef, sendPollId } = useWebSocket()

	// Работа вебсокетов
	useEffect(() => {
		const checkConnection = setInterval(() => {
			if (clientSocketRef.current && clientSocketRef.current.readyState === WebSocket.OPEN) {
				clearInterval(checkConnection)
				clientSocketRef.current.onmessage = async({data}) => {
					const parsedData = JSON.parse(data)
					console.log('Получено сообщение: ', parsedData)
					switch (parsedData.type) {
						case 'startPoll':
							console.log('Начало голосования')
							setPollState('starting')
							break
						case 'questionChanged':
							console.log('Смена вопроса')
							setQuestion_id(parsedData.question_id)
							break
						case 'pollEnded':
							console.log('Конец голосования')
							await updateStatus(id, 'over')
							setPollState('over')
							break
						default:
							console.log('Непонятно...')
							break
					}
				}

				sendPollId(id)
			} else {
				console.log('Не готово')
			}
		}, 500)	

		return () => {
			clearInterval(checkConnection)
		}
	}, [clientSocketRef.current])

	// Действия и проверки при заходе на страницу

	useEffect(() => {
		try {
			getPollStatus(id).then(data => {
				console.log(data)
				if (data.status === 'ongoing' || pollState === 'starting' || data.status === 'starting') {
					setQuestion_id(data.question_id)
				} else if (data.status === 'over') {
					setPollState('over')
					Object.keys(localStorage).forEach(key => {
						if (key.startsWith(`answer_${userId}_`)) {
							localStorage.removeItem(key);
							console.log('fqm')
						}
					});
				}
			})
		} catch {
			console.log('Опрос еще не создан')
		}	
	}, [pollState])

	useEffect(() => {
		if (question_id) {
			// Изменяем стили кнопки отправки ответа
			$('.submit_answer').css({ background: '#ffd6ae' });
	
			if (!question) {
				get_one(question_id).then(data => {
					setQuestion(data.question_text);
				});
			}
	
			// Загружаем ответы для текущего вопроса
			gAFQ_id(question_id, id).then(data => {
				setAnswers(data);
			});
	
			// Проверяем, есть ли уже сохранённый ответ для текущего вопроса
			const savedAnswers = JSON.parse(localStorage.getItem('user_answers')) || {};
			const savedAnswerId = savedAnswers[question_id];
	
			if (savedAnswerId) {
				setSelectedAnswer(savedAnswerId); // Устанавливаем ответ как выбранный
				setIsSubmitted(true); // Блокируем повторное голосование
	
				// Если ответы уже загружены, то визуально выделяем выбранный ответ
				if (answers && answers.length > 0) {
					const savedIndex = answers.findIndex(answer => answer.id === savedAnswerId);
					if (savedIndex !== -1) {
						$(`.answer_variant:eq(${savedIndex})`).css({
							background: '#ffd6ae',
							border: '1px #ffd6ae solid',
						});

						$('.submit_answer').css({background: '#ffa54a'})
					}
				}
			} else {
				setSelectedAnswer(null); // Сбрасываем состояние, если ответа нет
				setIsSubmitted(false);
			}
		}
	}, [question_id, answers]); // Добавляем зависимость от answers
	


	useEffect(() => {
		if (answers && Array.isArray(answers) && answers.length > 0) {
			setPollState('ongoing')
		}
	}, [answers])
	// вот тут заканчиваются проверки при заходе на страницу


	// Выбор и отпрака ответа
	const handleAnswerClick = async(id, index) => {
		if (isSubmitted) {
            return;
        }
        $('.answer_variant').css({ background: '#efefef', border: '1px solid #e1e1e1' });
        $(`.answer_variant:eq(${index})`).css({ background: '#ffd6ae', border: '1px #ffd6ae solid' });
        $('.submit_answer').css({ background: '#ffa54a', cursor: 'pointer' });

    	const questionKey = `answer_${userId}_${question_id}`;
    	localStorage.setItem(questionKey, JSON.stringify(id));

        setSelectedAnswer(id);
    };

	const handleSubmit = async () => {	
		if (selectedAnswer === null || isSubmitted === true) {
            return;
        }
        setIsSubmitted(true);
	};

	useEffect(() => {
    if (selectedAnswer != null && isSubmitted) {
        const savedAnswers = JSON.parse(localStorage.getItem('user_answers')) || {};
        const hasAlreadyAnswered = savedAnswers[question_id];
        if (!hasAlreadyAnswered) {
            submitAnswer(1, selectedAnswer).then(data => {
                console.log(`Ответ ${selectedAnswer} отправлен.`);
                savedAnswers[question_id] = selectedAnswer;
                localStorage.setItem('user_answers', JSON.stringify(savedAnswers));

                setIsSubmitted(true);
            });
        } else {
            console.log('Ответ уже был отправлен для этого вопроса.');
        }
    }
}, [isSubmitted]);
	//

	if (pollState === 'waiting' || pollState === 'starting') {
		return (
			<div className='status_container'>
				<div className=''>

				</div>
			</div>
		)
	} else if (pollState === 'ongoing') {
		return (
			<>
				<div className='question_background'>
					<div className='gradient_backround'>

					</div>
				</div>
				<div className='questions_page'>
					<div className='questions_container'>
						<div className='image_container'>
							<img src='https://giffun.ru/wp-content/uploads/2022/10/smeshnye-kotiki-1.gif' height={'100%'} style={{objectFit: 'cover'}}>
								
							</img>
						</div>
						<div className='question_type'>
							<span>Вопрос с выбором ответа</span>
						</div>
						<div className='question_title_client'>
							<span>{question}</span>
						</div>
						<div className='answer_list_client'>
							{answers.map((answer, index) => 
										<Answer key={answer.id}
										id={answer.id}
										text={answer.answer}
										index={index}
										onAnswerClick={handleAnswerClick}/>)}
						</div>
						<div className='submit_answer' onClick={() => handleSubmit()}>
								<span>
									Ответить
								</span>
						</div>
					</div>
				</div>
			</>
		);
	} else if (pollState === 'over') {
		return (
			<>
				<div className='status_container'>
					<div className='congrad' style={{fontSize: '40px'}}>
						<span style={{fontSize: '35px', color: '#fc8b19'}}>Спасибо за участие</span> <br></br>
						<span>Ваши голоса будут учтены!</span>
					</div>
					<Link to={'http://localhost:8100'}>
						<div className='to_main_page'>
							Вернуться на главную страницу
						</div>
					</Link>
				</div>
			</>
		)
	}
}

export default QuestionPage;