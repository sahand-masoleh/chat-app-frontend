import { createContext, useEffect, useState } from "react";
import useConnection from "../hooks/useConnection";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
	const { create, join, leave, room, sendText, sendFile } = useConnection({
		handleText,
		handleFile,
		handleFileRequest,
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

	function handleFileRequest(request, info) {
		const { sender, size, name, timeStamp } = info;
		setMessages((messages) => [
			...messages,
			{ type: "request", sender, size, name, timeStamp, request },
		]);
	}

	function handleFile(arrayBuffer, name) {
		try {
			const blob = new Blob([arrayBuffer]);
			const a = document.createElement("a");
			const url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = name;
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
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
