function setupTextChannel(channel, hookMethods) {
	channel.binaryType = "arraybuffer";

	// events
	{
		channel.onerror = (error) => console.error(error);
		channel.onmessage = (message) => {
			const { text, sender } = JSON.parse(message.data);
			hookMethods.receiveText(text, sender);
		};
	}
	// functions
	function sendText(text, sender) {
		channel.send(JSON.stringify({ text, sender }));
	}

	return { sendText };
}

export default setupTextChannel;
