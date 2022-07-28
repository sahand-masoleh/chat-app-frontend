import { createContext, useState } from "react";

export const ThemeContext = createContext();

import { light, dark } from "@/styles/themes";

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(false);

	function changeTheme() {
		setIsDark((prev) => !prev);
	}

	return (
		<ThemeContext.Provider value={{ isDark, changeTheme }}>
			<div className="theme-wrapper" style={!isDark ? light : dark}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
}
