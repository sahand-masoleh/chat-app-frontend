function Chat({ room, screenName, sendMessage }) {
	return (
		<div>
			<h2>{room}</h2>
			<h3>{screenName}</h3>
		</div>
	);
}

export default Chat;
