import React from "react";

import { Routes, Route } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";

export default function AppRouter() {
	const isAuth = false; //TODO: take isauth from back
	return (
		<Routes>
			{isAuth &&
				authRoutes.map(({ path, Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}
			{publicRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}

		</Routes>
	);
}
