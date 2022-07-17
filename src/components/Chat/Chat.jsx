import "./Chat.scss";
import { useState, useContext, useMemo, useRef } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as AttachIcon } from "../../assets/icons/attach.svg";

function Chat() {
	return (
		<main className="chat">
			<Top />
			<Messages />
			<Bottom />
		</main>
	);
}

export default Chat;

function Top() {
	const { room, screenName } = useContext(ConnectionContext);
	return (
		<div className="top">
			<div className="top__wrapper wrapper">
				<h2 className="top__room">{room}</h2>
				<h3 className="top__name">{screenName}</h3>
			</div>
		</div>
	);
}

function Messages() {
	const { messages } = useContext(ConnectionContext);
	const messagesMap = useMemo(() => {
		return messages.map((entry) => {
			const { type } = entry;
			if (type === "text") {
				const { text, sender, timeStamp } = entry;
				return <p key={timeStamp}>{`${sender}: ${text}`}</p>;
			} else if (type === "request") {
				// info = {type, sender, size, name, timeStamp, request}
				const { sender, timeStamp, name, size, request } = entry;
				return (
					<div key={timeStamp}>
						{`${sender}: ${name} (${size})`}
						<button onClick={() => request.accept()}>accept</button>
						<button onClick={() => request.refuse()}>refuse</button>
					</div>
				);
			}
		});
	}, [messages]);

	return (
		<div className="messages">
			<div className="messages__wrapper wrapper">{messagesMap}</div>
		</div>
	);
}

function Bottom() {
	const { sendText, sendFile, screenName } = useContext(ConnectionContext);

	const [input, setInput] = useState("");
	const textRef = useRef();
	const fileRef = useRef();

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleSendMessage() {
		sendText(input, screenName);
		setInput("");
		textRef.current.focus();
	}

	function handleChooseFile(event) {
		event.preventDefault();
		fileRef.current.click();
	}

	async function handleSendFile() {
		const file = fileRef.current.files[0];
		const info = {
			type: "file",
			sender: screenName,
			size: file.size,
			name: file.name,
		};
		if (file) {
			await sendFile(file, info);
		}
	}

	return (
		<div className="bottom">
			<div className="bottom__wrapper wrapper">
				{/* TEXT */}
				<textarea
					rows="2"
					className="bottom__textarea"
					onChange={handleInputChange}
					value={input}
					ref={textRef}
				></textarea>
				<button
					className="bottom__button chat-button"
					onClick={handleSendMessage}
				>
					<SendIcon className="chat-button__svg" />
				</button>
				{/* FILE */}
				<input
					type="file"
					className="bottom__file-input"
					ref={fileRef}
					onChange={handleSendFile}
				/>
				<button
					className="bottom__button chat-button"
					onClick={handleChooseFile}
				>
					<AttachIcon className="chat-button__svg" />
				</button>
			</div>
		</div>
	);
}
