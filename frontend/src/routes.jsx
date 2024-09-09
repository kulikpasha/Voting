
import {
	ADMIN_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
	VOTES_ROUTE,
	POLL_ROUTE,
	QUESTION_ROUTE,
	POLL_RESULT_ROUTE,
	POLL_ADMIN_ROUTE,
} from "./utils/consts";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Votes from "./pages/Votes";
import PollPage from "./pages/PollPage";
import Question from "./pages/QuestionPage";
import PollResult from "./pages/PollResult";
import PollAdmin from "./pages/PollAdmin";
import { Component } from "react";

export const authRoutes = [{ path: ADMIN_ROUTE, Component: Admin }];
export const publicRoutes = [
	{
		path: LOGIN_ROUTE,
		Component: Auth,
	},
	{
		path: REGISTRATION_ROUTE,
		Component: Auth,
	},
	{
		path: VOTES_ROUTE,
		Component: Votes,
	},
	{
		path: POLL_ROUTE + "/:id",
		Component: PollPage,
	},
	{
		path: POLL_ADMIN_ROUTE + "/:id",
		Component: PollAdmin,
	},
	{
		path: QUESTION_ROUTE + "/:id",
		Component: Question,
	},
	{
		path: POLL_RESULT_ROUTE + "/:id",
		Component: PollResult,
	},
	{
		path: ADMIN_ROUTE,
		Component: Admin,
	},
];
