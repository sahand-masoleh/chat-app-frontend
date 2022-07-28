import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

import { light, dark } from "@/styles/themes";

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const storedIsDark = window.localStorage.getItem("is-dark");
		if (storedIsDark === "true") {
			setIsDark(true);
		}
	}, []);

	function changeTheme() {
		setIsDark((prev) => {
			window.localStorage.setItem("is-dark", !prev);
			return !prev;
		});
	}

	return (
		<ThemeContext.Provider value={{ isDark, changeTheme }}>
			<div className="theme-wrapper" style={!isDark ? light : dark}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
}
