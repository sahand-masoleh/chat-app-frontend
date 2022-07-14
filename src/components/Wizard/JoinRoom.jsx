import { useState, useContext } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function JoinRoom({ back }) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { join } = useContext(ConnectionContext);

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
