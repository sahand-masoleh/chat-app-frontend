import { useState, useContext, useMemo, useRef } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function Chat() {
	const { room, screenName, sendMessage, sendFile, messages } =
		useContext(ConnectionContext);
	const [input, setInput] = useState("");
	const fileRef = useRef();

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleSendMessage() {
		sendMessage(screenName, input);
	}

	async function handleSendFile(event) {
		event.preventDefault();
		const file = fileRef.current.files[0];
		await sendFile(file, file.name);
	}

	const messagesMap = useMemo(() => {
		return messages.map((entry) => {
			const { timeStamp, screenName, message } = entry;
			return <p key={timeStamp}>{`${screenName}: ${message}`}</p>;
		});
	}, [messages]);

	return (
		<main className="chat">
			<h2>{room}</h2>
			<h3>{screenName}</h3>
			<div className="chat__mesages">{messagesMap}</div>
			<div className="chat__input new-message">
				<input
					type="text"
					className="new-message__input"
					onChange={handleInputChange}
					value={input}
				/>
				<button className="new-message__text-btn" onClick={handleSendMessage}>
					send text
				</button>
				<form>
					<input type="file" id="file-input" ref={fileRef} />
					<button onClick={handleSendFile}>send file</button>
				</form>
			</div>
		</main>
	);
}

export default Chat;
