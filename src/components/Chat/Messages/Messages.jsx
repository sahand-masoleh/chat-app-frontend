import "./Messages.scss";

import {
	useContext,
	useMemo,
	useRef,
	useEffect,
	useState,
	Fragment,
} from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";

import Linkify from "linkify-react";

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

	const messagesMap = () =>
		useMemo(() => {
			{
				let lastSender = "";
				return messages.map((entry) => {
					const { type, dir, sender, timeStamp } = entry;
					// see if the sender of the current message is the same as the last
					let neu = lastSender === sender ? false : true;
					lastSender = sender;

					const senderComp = () => {
						if (neu && dir === "in") {
							return <div className="sender">{sender}:</div>;
						}
					};

					const messageComp = () => {
						if (type === "text") {
							const { text } = entry;

							return (
								<div className={BEM("text-message", "", dir)}>
									<p
										className={BEM(
											"text-message",
											"content",
											dir,
											neu && "neu"
										)}
									>
										<Linkify options={{ target: "_blank" }}>{text}</Linkify>
									</p>
								</div>
							);
						} else if (type === "request") {
							const { size, name, request } = entry;
							return (
								<Request
									dir={dir}
									request={request}
									name={name}
									size={size}
									timeStamp={timeStamp}
								/>
							);
						}
					};

					return (
						<Fragment key={timeStamp}>
							{senderComp()}
							{messageComp()}
						</Fragment>
					);
				});
			}
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
			<div className="messages__wrapper wrapper">{messagesMap()}</div>
		</div>
	);
}

export default Messages;
