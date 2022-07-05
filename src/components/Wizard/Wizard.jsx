import { useState, useEffect } from "react";
import Guest from "./Guest";
import ChooseName from "./ChooseName";

function Wizard({ create, join, room, screenName, setScreenName, setIsReady }) {
	const [isGuest, setIsGuest] = useState(null);

	useEffect(() => {
		if (room && screenName) setIsReady(true);
	}, [room, screenName]);

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
					<Guest join={join} back={handleGuest} />
				)
			) : (
				<ChooseName setScreenName={setScreenName} />
			)}
		</main>
	);
}

export default Wizard;
