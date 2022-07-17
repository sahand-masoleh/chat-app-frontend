import { useContext, useMemo } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

function Messages() {
	const { messages } = useContext(ConnectionContext);
	const messagesMap = useMemo(() => {
		return messages.map((entry) => {
			const { type } = entry;
			if (type === "text") {
				const { text, sender, timeStamp } = entry;
				return <p key={timeStamp}>{`${sender}: ${text}`}</p>;
			} else if (type === "request") {
				// info = {type, sender, size, name, timeStamp, request}
				const { sender, timeStamp, name, size, request } = entry;
				return (
					<div key={timeStamp}>
						{`${sender}: ${name} (${size})`}
						<button onClick={() => request.accept()}>accept</button>
						<button onClick={() => request.refuse()}>refuse</button>
					</div>
				);
			}
		});
	}, [messages]);

	return (
		<div className="messages">
			<div className="messages__wrapper wrapper">{messagesMap}</div>
		</div>
	);
}

export default Messages;
