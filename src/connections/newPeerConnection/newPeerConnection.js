import receiveDataChannel from "./receiveDataChannel";

var iceServers = {
	iceServers: [
		{
			urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
		},
	],
};

var MAX_PACKET_SIZE = 65535;

function newPeerConnection(hookMethods) {
	let peerConnection = new RTCPeerConnection(iceServers);

	/** CONNECTION EVENTS & FUNCTIONS */

	// HOST: create a new offer
	// wrapped in a promise so that we can wait for the ice gathering to finish
	function createOffer() {
		return new Promise(async (resolve, reject) => {
			try {
				let offer = peerConnection.createOffer();
				await peerConnection.setLocalDescription(offer);
				// wait until ice gathering is done before sending the answer
				peerConnection.onicegatheringstatechange = () => {
					if (peerConnection.iceGatheringState === "complete") {
						resolve();
					}
				};
			} catch (error) {
				reject(error);
			}
		});
	}
	// HOST: get the offer to be send to the guest
	async function getOffer() {
		await createOffer();
		return peerConnection.localDescription;
	}
	// GUEST: give the offer to the guest and get an answer
	// wrapped with a promise so that we can wait for the ice gathering to finish
	function getAnswer(offer) {
		return new Promise(async (resolve, reject) => {
			try {
				peerConnection.setRemoteDescription(offer);
				const answer = peerConnection.createAnswer();
				await peerConnection.setLocalDescription(answer);
				// wait until ice gathering is done before sending the answer
				peerConnection.onicegatheringstatechange = () => {
					if (peerConnection.iceGatheringState === "complete") {
						resolve(peerConnection.localDescription);
					}
				};
			} catch (error) {
				reject(error);
			}
		});
	}
	// HOST: add the answer from the guest
	function addAnswer(answer) {
		peerConnection.setRemoteDescription(answer);
	}

	/** MESSAGING EVENTS & FUNCTIONS */

	// channel
	const textChannel = peerConnection.createDataChannel("text-channel", {
		negotiated: true,
		id: 100,
	});
	textChannel.binaryType = "arraybuffer";
	// events
	{
		// textChannel.onopen = logEvent;
		// textChannel.onclose = logEvent;
		textChannel.onerror = (error) => console.error(error);
		textChannel.onmessage = receiveText;
	}
	// functions
	function sendText(text, sender) {
		textChannel.send(JSON.stringify({ text, sender }));
	}
	function receiveText(message) {
		const { timeStamp } = message;
		const { text, sender } = JSON.parse(message.data);
		hookMethods.receiveText(text, sender, timeStamp);
	}

	/** FILE TRANSFER EVENTS & FUNCTIONS */

	// events
	// RECEIVER
	peerConnection.ondatachannel = (event) =>
		receiveDataChannel(event, hookMethods);

	// functions
	// SENDER
	function sendFile(arrayBuffer, info) {
		const channel = peerConnection.createDataChannel("data-channel");
		// chrome does not support blob
		channel.binaryType = "arraybuffer";

		// fist the info is sent
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

	return {
		createOffer,
		getOffer,
		getAnswer,
		addAnswer,
		sendText,
		sendFile,
	};
}

export default newPeerConnection;
