import "./Bottom.scss";
import { useState, useContext, useRef } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as AttachIcon } from "../../assets/icons/attach.svg";

function Bottom() {
	const { sendText, sendFile } = useContext(ConnectionContext);
	const [input, setInput] = useState("");
	const textRef = useRef();
	const fileRef = useRef();

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleSendMessage() {
		if (input) {
			sendText(input);
			setInput("");
			textRef.current.focus();
		}
	}

	function handleChooseFile(event) {
		event.preventDefault();
		fileRef.current.click();
	}

	async function handleSendFile() {
		const file = fileRef.current.files[0];
		if (file) {
			sendFile(file);
		}
	}

	function handleKeyDown(event) {
		if (event.key === "Enter" && document.activeElement.dataset.textarea) {
			event.preventDefault();
			event.stopPropagation();
			handleSendMessage();
		}
	}

	return (
		<div className="bottom">
			<div className="bottom__wrapper wrapper">
				{/* TEXT */}
				{/* TODO: textarea should increase in size based on content */}
				<textarea
					className="bottom__textarea"
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					value={input}
					ref={textRef}
					data-textarea
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

export default Bottom;
