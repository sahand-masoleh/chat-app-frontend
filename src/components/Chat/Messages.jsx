import "./Messages.scss";

import { useContext, useMemo, useRef, useEffect, useState } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";

import debounce from "../../utils/debounce";

function Messages() {
	const { messages } = useContext(ConnectionContext);
	const messagesRef = useRef();
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		if (messages.length) {
			const { type } = messages[messages.length - 1];
			if (type === "text-out" || (type === "text-in" && isAtBottom)) {
				messagesRef.current.scroll({
					top:
						messagesRef.current.scrollHeight - messagesRef.current.clientHeight,
				});
			}
		}
	}, [messages]);

	const messagesMap = useMemo(() => {
		return messages.map((entry) => {
			const { type } = entry;
			if (type === "text-in" || type === "text-out") {
				const { text, sender, timeStamp } = entry;
				return (
					<div
						className={`text-message text-message--${
							type === "text-out" ? "out" : "in"
						}`}
						key={timeStamp}
					>
						{text}
					</div>
				);
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

	function handleScroll() {
		if (
			messagesRef.current.scrollHeight ===
			messagesRef.current.scrollTop + messagesRef.current.clientHeight
		) {
			setIsAtBottom(true);
		} else setIsAtBottom(false);
	}
	const debouncedHandleScroll = debounce(handleScroll, 250);

	return (
		<div
			className="messages"
			ref={messagesRef}
			onScroll={debouncedHandleScroll}
		>
			<div className="messages__wrapper wrapper">{messagesMap}</div>
		</div>
	);
}

export default Messages;
