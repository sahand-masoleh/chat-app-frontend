import { useState, useContext, useMemo } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function Chat() {
	const { room, screenName, sendMessage, messages } =
		useContext(ConnectionContext);
	const [input, setInput] = useState("");

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleSendMessage() {
		sendMessage(screenName, input);
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
			<div className="chat__new-message new-message">
				<input
					type="text"
					className="new-message__input"
					onChange={handleInputChange}
					value={input}
				/>
				<button
					className="new-message__send-button"
					onClick={handleSendMessage}
				>
					send
				</button>
			</div>
		</main>
	);
}

export default Chat;
