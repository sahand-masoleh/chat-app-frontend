import { createContext, useEffect, useState } from "react";
import useConnection from "../hooks/useConnection";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
	const { room, join, create, sendMessage, screenName, setScreenName } =
		useConnection({ printMessage });
	const [isReady, setIsReady] = useState(false);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (room && screenName) setIsReady(true);
	}, [room, screenName]);

	function printMessage(message) {
		setMessages((messages) => [...messages, message]);
	}

	return (
		<ConnectionContext.Provider
			value={{
				room,
				join,
				create,
				sendMessage,
				screenName,
				setScreenName,
				isReady,
				messages,
			}}
		>
			{children}
		</ConnectionContext.Provider>
	);
}
