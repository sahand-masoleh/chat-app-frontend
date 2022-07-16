import { useState, useContext, useEffect } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function ChooseName({ back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { setScreenName } = useContext(ConnectionContext);

	useEffect(() => {
		let storedScreenName = window.localStorage.getItem("screen-name");
		if (storedScreenName) {
			setInput(storedScreenName);
		}
	}, []);

	useEffect(() => {
		if (/^[a-z0-9]{1,8}$/i.test(input)) {
			setIsValid(true);
		} else setIsValid(false);
	}, [input]);

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleClick() {
		setScreenName(input);
		window.localStorage.setItem("screen-name", input);
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
