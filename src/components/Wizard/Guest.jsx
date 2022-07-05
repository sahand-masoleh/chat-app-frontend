import { useState } from "react";

function Guest({ join, back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);

	function handleInput(event) {
		const { value } = event.target;
		setInput(value.toUpperCase());
		if (/^[a-z0-9]{8}$/i.test(value)) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}

	function handleJoin() {
		if (isValid) {
			join(input);
		}
	}

	return (
		<div className="wizard__enter-room">
			<button className="wizard__button" onClick={back}>
				back
			</button>
			<input
				type="text"
				className="wizard__input"
				value={input}
				onChange={handleInput}
			/>
			<button
				className="wizard__button"
				onClick={handleJoin}
				disabled={!isValid}
			>
				enter room
			</button>
		</div>
	);
}

export default Guest;
