import { createContext, useEffect, useRef, useState } from "react";
import useConnection from "@/hooks/useConnection";

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
	const downloadList = useRef({});

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
	function handleFile(downloaded, timeStamp, blob) {
		if (downloaded === "done") {
			const url = window.URL.createObjectURL(blob);
			downloadList.current[timeStamp] = url;
		} else {
			downloadList.current[timeStamp] = downloaded;
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

		sendFileHook(file, info);
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
				downloadList,
			}}
		>
			{children}
		</ConnectionContext.Provider>
	);
}
