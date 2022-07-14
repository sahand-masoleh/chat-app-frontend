import { useState, useContext } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function ChooseName({ back }) {
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
		<>
			<div className="input-box">
				<label htmlFor="input" className="input-box__title">
					choose a screen name
				</label>
				<input
					id="input"
					type="text"
					className="input-box__input"
					onChange={handleInputChange}
					value={input}
				/>
			</div>
			<button
				className="wizard-button"
				onClick={handleClick}
				disabled={!isValid}
			>
				start chatting
			</button>
			<button className="wizard-button" onClick={back}>
				back
			</button>
		</>
	);
}

export default ChooseName;
