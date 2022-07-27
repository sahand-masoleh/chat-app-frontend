import "./Chat.scss";

import Messages from "./Messages";
import Top from "./Top";
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
