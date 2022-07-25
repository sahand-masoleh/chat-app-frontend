import "./Chat.scss";
import { useContext } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";

import Messages from "./Messages";
import Bottom from "./Bottom";

function Chat() {
	return (
		<main className="chat">
			<Top />
			<Messages />
			<Bottom />
		</main>
	);
}

export default Chat;

function Top() {
	const { room, screenName } = useContext(ConnectionContext);

	function roomWithSpace(num) {
		const regex = /(\w\w?)/g;
		return num.match(regex).join(" ");
	}

	return (
		<div className="top">
			<div className="top__wrapper wrapper">
				<h2 className="top__room">{room && roomWithSpace(room)}</h2>
				<h3 className="top__name">@{screenName}</h3>
			</div>
		</div>
	);
}
