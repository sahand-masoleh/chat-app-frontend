import "./Wizard.scss";
import { useState, useContext } from "react";
import JoinRoom from "./JoinRoom";
import ChooseName from "./ChooseName";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function Wizard() {
	const { create, room, leave } = useContext(ConnectionContext);
	const [isGuest, setIsGuest] = useState(null);

	function handleGuest() {
		setIsGuest((curr) => !curr);
	}

	return (
		<main className="wizard">
			{!room ? (
				!isGuest ? (
					<>
						<button className="wizard-button" onClick={create}>
							<b>start</b> a conversation
						</button>
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
