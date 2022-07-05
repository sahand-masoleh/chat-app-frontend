import { useState } from "react";

function ChooseName({ setScreenName }) {
	const [input, setInput] = useState("");

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleClick() {
		setScreenName(input);
	}

	return (
		<div className="wizard__enter-name">
			<h2 className="wizard__title">choose a screen name</h2>
			<input
				type="text"
				className="wizard__input"
				onChange={handleInputChange}
				value={input}
			/>
			<button className="wizard__button" onClick={handleClick}>
				start chatting
			</button>
		</div>
	);
}

export default ChooseName;
