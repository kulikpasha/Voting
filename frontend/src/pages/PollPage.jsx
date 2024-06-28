import React, { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import Button from '../components/Button/Button';
import { fetchOnePoll } from "../http/pollAPI";
import { nextQuestion } from '../http/questionAPI';
import '../components/PollPage.css';
import { useParams, useNavigate, Link } from "react-router-dom";

export default function PollPage() {
	const { id } = useParams();
	const questionPageUrl = `${window.location.origin}/question/${id}`;
	const [poll, setPoll] = useState({ instructions: [], ingridients: [] });
	const navigate = useNavigate();

	useEffect(() => {
		fetchOnePoll(id).then((data) => setPoll(data));
	}, [id]);

	const startPoll = () => {
		console.log('Опрос начат');
		nextQuestion(id)
			.then((data) => {
				console.log(data);
				navigate(`/polladmin/${id}`);
			})
			.catch((error) => console.error("Ошибка при загрузке следующего вопроса", error));
	};

	return (
		<>
			<div className="info">
				<div className="voteTitle"><strong>{poll.title}</strong></div>
				<div className="voteDescription">{poll.description}</div>
				<div className="voteAuthor">Автор голосования: <strong>{poll.user_name}</strong></div>
			</div>

			<div className="qr-code-container" style={{ textAlign: 'center', margin: '20px 0' }}>
				<Link key={id} to={questionPageUrl}>
					<QRCode value={questionPageUrl} size={128} /></Link>
				<h3>Сканируйте QR-код, чтобы перейти на страницу голосования</h3>
			</div>
			<div style={{ textAlign: 'center', margin: '20px 0' }}>
				<Button onClick={startPoll}>Начать опрос</Button>
			</div>
		</>
	);
}