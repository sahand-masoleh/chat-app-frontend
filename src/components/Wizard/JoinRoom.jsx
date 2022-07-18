import { useState, useContext } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

var MAX_LENGTH = 8;

function JoinRoom({ back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { join } = useContext(ConnectionContext);

	function handleInput(event) {
		const { value } = event.target;
		setInput(value.toUpperCase());
		const regex = new RegExp(`^[a-z0-9]{${MAX_LENGTH}}$`, "i");
		if (regex.test(value)) {
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
		<>
			<div className="input-box">
				<label htmlFor="input" className="input-box__title">
					enter the room number
				</label>
				<input
					id="input"
					type="text"
					className="input-box__input"
					value={input}
					onChange={handleInput}
					maxLength={MAX_LENGTH}
				/>
			</div>
			<button
				className="wizard-button"
				onClick={handleJoin}
				disabled={!isValid}
			>
				enter room
			</button>
			<button className="wizard-button" onClick={back}>
				back
			</button>
		</>
	);
}

export default JoinRoom;
