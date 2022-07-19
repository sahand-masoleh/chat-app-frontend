import "./Messages.scss";

import { useContext, useMemo, useRef, useEffect, useState } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";

import debounce from "@/utils/debounce";
import BEM from "@/utils/BEM";

import Request from "./Request";

function Messages() {
	const { messages } = useContext(ConnectionContext);
	const messagesRef = useRef();
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		if (messages.length) {
			const { dir } = messages[messages.length - 1];
			if (dir === "out" || (dir === "in" && isAtBottom)) {
				messagesRef.current.scroll({
					top:
						messagesRef.current.scrollHeight - messagesRef.current.clientHeight,
				});
			}
		}
	}, [messages]);

	const messagesMap = () => {
		let lastSender = "";
		return messages.map((entry) => {
			const { type, dir, sender, timeStamp } = entry;
			// see if the sender of the current message is the same as the last
			let neu = lastSender === sender ? false : true;
			lastSender = sender;

			if (type === "text") {
				const { text } = entry;
				// TODO: move sender to its own component
				// TODO: detect links
				return (
					<div key={timeStamp} className={BEM("text-message", "", dir)}>
						{neu && dir === "in" && (
							<p className={BEM("text-message", "sender", dir)}>{sender}</p>
						)}
						<p className={BEM("text-message", "content", dir, neu && "neu")}>
							{text}
						</p>
					</div>
				);
			} else if (type === "request") {
				// TODO: outbound requests
				if (dir === "in") {
					const { size, name, request } = entry;
					return (
						<Request
							key={timeStamp}
							dir={dir}
							request={request}
							name={name}
							size={size}
							timeStamp={timeStamp}
						/>
					);
				}
			}
		});
	};

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
			<div className="messages__wrapper wrapper">{messagesMap()}</div>
		</div>
	);
}

export default Messages;
