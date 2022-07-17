import newRequest from "./newRequest";

function receiveDataChannel(event, hookMethods) {
	const { channel } = event;
	// chrome does not support blob
	channel.binaryType = "arraybuffer";

	const receivedBuffers = [];
	// info = {type, sender, size, name}
	let info = null;
	let timeStamp = null;
	channel.onmessage = async (message) => {
		const { data } = message;
		try {
			// info is the first packet sent
			// empty means the beginning
			if (!info) {
				info = JSON.parse(data);
				timeStamp = message.timeStamp;
				// we need the user's permission to receive the file
				// newRequest() wraps around promise
				// resovle() and reject() are passed to the client
				const request = newRequest();
				hookMethods.receiveFileRequest(
					{ accept: request.accept, refuse: request.refuse },
					{ ...info, timeStamp }
				);
				try {
					await request.waitForClient();
				} catch {
					throw new Error("rejected");
				}
				channel.send("ACCEPT");
			}
			// 'EOF' is the last packet sent
			// anything but the first and last packet is the file itself
			else if (data !== "EOF") {
				// the file is split into chunks and put into a regular array
				receivedBuffers.push(data);
			}
			// this is the 'EOF' signal
			else {
				// putting the chunks together into one file
				const arrayBuffer = receivedBuffers.reduce((prev, curr) => {
					const tmp = new Uint8Array(prev.byteLength + curr.byteLength);
					tmp.set(new Uint8Array(prev), 0);
					tmp.set(new Uint8Array(curr), prev.byteLength);
					return tmp;
				}, new Uint8Array());
				// pass the file to the client and close the channel
				// the channel is closed on both devices
				hookMethods.receiveFile(arrayBuffer, info.name);
				channel.close();
			}
		} catch (error) {
			channel.close();
			console.error(error);
		}
	};

	// unsubscribe from events
	channel.onclose = () => {
		channel.onopen = null;
		channel.onmessage = null;
		channel.onclose = null;
	};
}

export default receiveDataChannel;
