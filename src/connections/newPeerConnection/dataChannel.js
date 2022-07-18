import newRequest from "./newRequest";

var MAX_PACKET_SIZE = 65535;

// create a datachannel to transfer  a file
export function send(channel, arrayBuffer, info) {
	// chrome does not support blob
	channel.binaryType = "arraybuffer";

	// first the info is sent
	// the receiver can either accept or refuse the file
	channel.onopen = () => {
		channel.send(JSON.stringify(info));
	};

	channel.onmessage = (message) => {
		const { data } = message;

		// only if the receiver sends an 'ACCEPT' signal, start uploading
		if (data === "ACCEPT") {
			// split the file into chunks
			for (let i = 0; i < arrayBuffer.byteLength; i += MAX_PACKET_SIZE) {
				channel.send(arrayBuffer.slice(i, i + MAX_PACKET_SIZE));
			}
			// send an 'EOF' signal to the receiver
			// so that they the upload is complete
			channel.send("EOF");
		}
	};

	// unsubscribe from events
	channel.onclose = () => {
		channel.onopen = null;
		channel.onmessage = null;
		channel.onclose = null;
	};
}

// react to data channel created by the sender to transfer a file
export function receive(channel, hookMethods) {
	// chrome does not support blob
	channel.binaryType = "arraybuffer";

	const receivedBuffers = [];
	// info = {sender, size, name}
	let info = null;
	let timeStamp;

	channel.onmessage = async (message) => {
		const { data } = message;
		try {
			// info is the first packet sent
			// empty means the beginning
			if (!info) {
				info = JSON.parse(data);
				// we need the user's permission to receive the file
				// newRequest() wraps around promise
				// resovle() and reject() are passed to the client
				const request = newRequest();
				hookMethods.receiveFileRequest(
					{ accept: request.accept, refuse: request.refuse },
					info
				);
				try {
					timeStamp = await request.waitForClient();
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
				hookMethods.receiveFile(arrayBuffer, info.name, timeStamp);
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
