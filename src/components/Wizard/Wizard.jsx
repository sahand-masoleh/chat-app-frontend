import { useState, useEffect, useContext } from "react";
import Guest from "./Guest";
import ChooseName from "./ChooseName";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function Wizard() {
	const { create, room } = useContext(ConnectionContext);
	const [isGuest, setIsGuest] = useState(null);

	function handleGuest() {
		setIsGuest((curr) => !curr);
	}

	return (
		<main className="wizard">
			{!room ? (
				!isGuest ? (
					<div className="wizard__select-role">
						<button className="wizard__button" onClick={create}>
							start a conversation
						</button>
						<button className="wizard__button" onClick={() => handleGuest()}>
							join a conversation
						</button>
					</div>
				) : (
					<Guest back={handleGuest} />
				)
			) : (
				<ChooseName />
			)}
		</main>
	);
}

export default Wizard;
