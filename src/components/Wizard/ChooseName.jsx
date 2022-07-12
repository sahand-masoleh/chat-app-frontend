import { useState, useContext } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function ChooseName() {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { setScreenName } = useContext(ConnectionContext);

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
		if (/^[a-z0-9]{1,8}$/i.test(value)) {
			setIsValid(true);
		} else setIsValid(false);
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
			<button
				className="wizard__button"
				onClick={handleClick}
				disabled={!isValid}
			>
				start chatting
			</button>
		</div>
	);
}

export default ChooseName;
