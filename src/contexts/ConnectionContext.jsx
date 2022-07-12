import { createContext, useEffect, useState } from "react";
import useConnection from "../hooks/useConnection";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
	// 	const { room, join, create, sendMessage, screenName, setScreenName } =
	const { create, join, room, sendMessage } = useConnection(printMessage);
	const [isReady, setIsReady] = useState(false);
	const [screenName, setScreenName] = useState("");
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
				// from the hook
				room,
				join,
				create,
				sendMessage,
				// added in the context
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
