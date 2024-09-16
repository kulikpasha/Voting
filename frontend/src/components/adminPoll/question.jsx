import React, {useEffect, useState} from 'react'
import Answer from './answer'
import { gAFQ_id } from '../../http/answerAPI'

export default function AP_Question( {id, poll_id, question_text, img } ) {
    const [newQuestion, setNewQuestion] = useState()
    const [newAnswers, setNewAnswers] = useState([])
    useEffect(() => {
        gAFQ_id(id).then(data => {
            setNewAnswers(data)
        }).catch (error => {
            console.log(error);
            setError('Ошибка: сервер бэкенда не доступен');
			setIsLoading(false);
        }) 
    }, [])
    return (
        <>
            <div className={`OfPollId${poll_id} question`}>
                <div className={'question_title'}>
                    <div className='QT_input' contentEditable='true' suppressContentEditableWarning='true' onInput={e => setNewQuestion = e.target.innerText}>{question_text}</div>
                </div>
                <div className='answers'>
                    {newAnswers.map(newAnswer => (
                        <Answer key={newAnswer.id} {...newAnswer}/>
                    ))}
                </div>
            </div>
        </>
    )
}