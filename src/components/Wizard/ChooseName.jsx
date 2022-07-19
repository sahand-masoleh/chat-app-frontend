import { useState, useContext, useEffect } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";

import { generateSlug } from "random-word-slugs";

import { ReactComponent as RetryIcon } from "../../assets/icons/retry.svg";

function ChooseName({ back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { setScreenName } = useContext(ConnectionContext);

	useEffect(() => {
		let storedScreenName = window.localStorage.getItem("screen-name");
		if (storedScreenName) {
			setInput(storedScreenName);
		} else {
			getRandomName();
		}
	}, []);

	useEffect(() => {
		if (/^[a-z0-9\s]{3,16}$/i.test(input)) {
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

	function getRandomName() {
		let name;
		do {
			name = generateSlug(2, { format: "title" });
		} while (name.length > 16);

		setInput(name);
	}

	return (
		<>
			<div className="input-box">
				<label htmlFor="input" className="input-box__title">
					choose a screen name
				</label>
				<button className="input-box__button icon" onClick={getRandomName}>
					<RetryIcon className="icon__svg" title="Get a New Name" />
				</button>
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
