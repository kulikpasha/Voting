import React, { useEffect, useState } from "react";
import './admin/admin.css'
import { fetchPolls } from '../http/pollAPI';
import AdminPoll from "../components/adminPoll/adminPoll";
import './admin/index'
import axios from 'axios';
import { deletePoll } from "../http/pollAPI";

export default function Admin() {
	const [polls, setPolls] = useState([])

	useEffect(() => {
		fetchPolls().then(data => {
			setPolls(data)
		}).catch(error => {
			console.error(error);
			setError('Ошибка: сервер бэкенда не доступен');
			setIsLoading(false);
		});
	}, [])

	async function handleDelete() {
		let elements = document.querySelectorAll('.choosen')
		elements.forEach(el => {
				deletePoll(el.id.slice(-1))
				setPolls(polls)
			})
		}

	return (
		<>
			<div className="main">
				<div className="inner-main">
					<div className="ap_title">
						Панель управления
					</div>
					<div className="b_row">
						<div className="controll_button">
							Добавить
						</div>
						<div className="controll_button delete" onClick={handleDelete}>
							Удалить
						</div>
					</div>
					<div className="polls_list">
						{polls.map(poll => (
							<AdminPoll key={poll.id} {...poll}/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
