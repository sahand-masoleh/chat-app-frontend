import "./Wizard.scss";
import { useState, useContext } from "react";
import JoinRoom from "./JoinRoom";
import ChooseName from "./ChooseName";
import { ConnectionContext } from "../../contexts/ConnectionContext";

import { ReactComponent as LoadingIcon } from "../../assets/icons/settings.svg";

function Wizard() {
	const { create, room, leave } = useContext(ConnectionContext);
	const [isGuest, setIsGuest] = useState(null);

	function handleGuest() {
		setIsGuest((curr) => !curr);
		if (room) leave();
	}

	return (
		<main className="wizard">
			{!room ? (
				!isGuest ? (
					<>
						<Button onClick={create} />
						<button className="wizard-button" onClick={handleGuest}>
							<b>join</b> a conversation
						</button>
					</>
				) : (
					<JoinRoom back={handleGuest} />
				)
			) : (
				<ChooseName back={leave} />
			)}
		</main>
	);
}

export default Wizard;

function Button({ onClick }) {
	const [isConnecting, setIsConnecting] = useState(false);
	function handleClick() {
		onClick();
		setIsConnecting(true);
	}

	return (
		<button className="wizard-button" onClick={handleClick}>
			{!isConnecting ? (
				<p>
					<b>start</b> a conversation
				</p>
			) : (
				<LoadingIcon className="wizard__icon icon" title="" />
			)}
		</button>
	);
}
