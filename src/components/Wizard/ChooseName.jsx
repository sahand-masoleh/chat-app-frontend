import { useState, useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";

import { generateSlug } from "random-word-slugs";

import { ReactComponent as RetryIcon } from "@/assets/icons/retry.svg";

var MAX_LENGTH = 16;
var MIN_LENGTH = 3;

function ChooseName({ back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { setScreenName } = useContext(ConnectionContext);
	const [wasClicked, setWasClicked] = useState(false);
	const inputRef = useRef();

	useEffect(() => {
		let storedScreenName = window.localStorage.getItem("screen-name");
		if (storedScreenName) {
			setInput(storedScreenName);
		} else {
			getRandomName();
		}
		inputRef.current.focus();
	}, []);

	useEffect(() => {
		const regex = new RegExp(`^[a-z0-9\\s]{${MIN_LENGTH},${MAX_LENGTH}}$`, "i");
		if (regex.test(input)) {
			setIsValid(true);
		} else setIsValid(false);
	}, [input]);

	function handleInputChange(event) {
		const { value } = event.target;
		setInput(value);
	}

	function handleChoose() {
		setScreenName(input);
		window.localStorage.setItem("screen-name", input);
	}

	function getRandomName() {
		setWasClicked(true);
		let name;
		do {
			name = generateSlug(2, { format: "title" });
		} while (name.length > 16);

		setInput(name);
	}

	function stopSpin() {
		setWasClicked(false);
	}

	// TODO: extract to a hook
	function handleKeyDown(event) {
		if (event.key === "Enter" && document.activeElement.dataset.input) {
			event.preventDefault();
			event.stopPropagation();
			handleChoose();
		}
	}

	return (
		<>
			<div className="input-box">
				<label htmlFor="input" className="input-box__title">
					choose a screen name
				</label>
				<button
					className={`input-box__button icon ${wasClicked && "icon--spin"}`}
					onClick={getRandomName}
					onAnimationEnd={stopSpin}
				>
					<RetryIcon className="icon__svg" title="Get a New Name" />
				</button>
				<input
					id="input"
					type="text"
					className="input-box__input"
					onChange={handleInputChange}
					value={input}
					onKeyDown={handleKeyDown}
					data-input
					ref={inputRef}
				/>
			</div>
			<button
				className="wizard-button"
				onClick={handleChoose}
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
