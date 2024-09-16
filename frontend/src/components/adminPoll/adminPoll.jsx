import React,{useEffect, useState} from "react";
import './adminPoll.css'
import open from '../../..//public/open.png'
import block from '/block.png'
import './index'
import { editPoll, getSinglePollQuestions } from "../../http/pollAPI";
import AP_Question from "./question";
import { editQuestion } from "../../http/questionAPI";

export default function AdminPoll({id , title, description, user_name, isOpen}) {
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);
    const [newIsOpen, setNewIsOpen] = useState(isOpen)
    const [newQuestions, setNewQuestions] = useState([]);

    const handleEdit = async (e) => {
        if (e.target.classList.contains('save')) {
            e.preventDefault();

            try {
                const response4Poll = await editPoll(id, newTitle, newDescription, newIsOpen)
                console.log('norm')
            } catch (err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        getSinglePollQuestions(id).then(data => {
            setNewQuestions(data)
            console.log(data)
        }).catch(error => {
            console.log(error);
            setError('Ошибка: сервер бэкенда не доступен');
			setIsLoading(false);
        })
    }, [])
    return (
        <>
        <div className="upperPoll" id={`upperPollId${id}`}>
            <div className="hider">
                <div className="admin_panel" id={`adminPanelId${id}`}>
                    <div className="editor">
                        <div className="poll_topEditor" id={`poll_topEditor${id}`}>
                            <div className="poll_title_editor">
                                <div className="edit" style={{fontSize: '40px', textDecoration: 'italic'}}>
                                    РЕДАКТИРОВАНИЕ
                                </div>
                                <div className='needHelp' type="text" defaultValue={newTitle} onInput={e => setNewTitle(e.target.innerText)} contentEditable='true' suppressContentEditableWarning='true'>{title}</div>
                            </div>
                            <div className="poll_description_editor">
                                <div className="needHelpToo" type="text" defaultValue={newDescription} onInput={e => setNewDescription(e.target.innerText)} contentEditable='true' suppressContentEditableWarning='true'>{description}</div>
                            </div>
                        </div>
                        <div className="poll_bottomEditor">
                            <div className="question_slider">
                                <div className="scroll" id={`scrollId${id}`}>
                                    {newQuestions.map(newQuestion => (
                                        <AP_Question key={newQuestion.id} {...newQuestion}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="poll" id={`pollId${id}`}>
                <div className="poll_title" >
                    <span>#{id}. </span>{newTitle}
                </div>
                <div className="poll_description">
                    <span style={{textDecoration: 'underline'}}>Описание: </span>
                    {newDescription}
                </div>
                <div className="status">
                    {isOpen ? <img src={open} width={'22px'}></img> : <img src={block} width={'22px'}></img>}
                    <span style={{margin: '0 0 0 10px'}}>Pohuy</span>
                </div>
                <div className="poll_creator">
                    Создатель: <span style={{fontStyle: 'italic', margin: '0 3px 0 0px'}}>{user_name}</span>
                </div>
                <div className="button highlight" id={id} onClick={handleEdit}>
                    Выделить
                </div>
                <div className="button render" id={id}>
                    Редактировать
                </div>
            </div>
        </div>
        </>
    )
}