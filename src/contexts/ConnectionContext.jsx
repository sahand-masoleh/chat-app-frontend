import { createContext, useEffect, useState } from "react";
import useConnection from "../hooks/useConnection";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
	const { create, join, leave, room, sendText, sendFile } = useConnection({
		handleText,
		handleFile,
	});
	const [isReady, setIsReady] = useState(false);
	const [screenName, setScreenName] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (room && screenName) setIsReady(true);
	}, [room, screenName]);

	function handleText(text, sender, timeStamp) {
		setMessages((messages) => [
			...messages,
			{ type: "text", text, sender, timeStamp },
		]);
	}

	function handleFile(blob, info) {
		console.log(blob);
		try {
			setMessages((messages) => [...messages, info]);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<ConnectionContext.Provider
			value={{
				// from the hook
				room,
				join,
				create,
				leave,
				sendText,
				sendFile,
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
