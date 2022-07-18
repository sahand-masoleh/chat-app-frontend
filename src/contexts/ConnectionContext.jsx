import { createContext, useEffect, useState } from "react";
import useConnection from "../hooks/useConnection";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
	const {
		create,
		join,
		leave,
		room,
		sendText: sendTextHook,
		sendFile: sendFileHook,
	} = useConnection({
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

	// TEXT MESSAGES
	function handleText(text, sender) {
		setMessages((messages) => [
			...messages,
			{ type: "text", dir: "in", text, sender, timeStamp: Date.now() },
		]);
	}
	function sendText(text) {
		if (text) {
			setMessages((messages) => [
				...messages,
				{
					type: "text",
					dir: "out",
					text,
					sender: screenName,
					timeStamp: Date.now(),
				},
			]);
			sendTextHook(text, screenName);
		}
	}

	// FILE TRANSFERS
	function handleFileRequest(request, info) {
		// info = { sender, size, name }
		setMessages((messages) => [
			...messages,
			{
				type: "request",
				dir: "in",
				request,
				timeStamp: Date.now(),
				...info,
			},
		]);
	}
	function handleFile(arrayBuffer, name, timeStamp) {
		try {
			const blob = new Blob([arrayBuffer]);
			const url = window.URL.createObjectURL(blob);
			setMessages((messages) => {
				const index = messages.findIndex((e) => e.timeStamp === timeStamp);
				const tempMessages = [...messages];
				tempMessages[index].url = url;
				return tempMessages;
			});
		} catch (error) {
			console.error(error);
		}
	}
	async function sendFile(file) {
		const info = {
			sender: screenName,
			size: file.size,
			name: file.name,
		};
		setMessages((messages) => [
			...messages,
			{ type: "request", dir: "out", timeStamp: Date.now(), ...info },
		]);
		await sendFileHook(file, info);
	}

	return (
		<ConnectionContext.Provider
			value={{
				// from the hook
				room,
				join,
				create,
				leave,
				sendFile,
				// added in the context
				sendText,
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
