var iceServers = {
	iceServers: [
		{
			urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
		},
	],
};

function newPeerConnection(printMessage) {
	let peerConnection = new RTCPeerConnection(iceServers);

	// message channel
	const messageChannel = peerConnection.createDataChannel("message-channel", {
		negotiated: true,
		id: 100,
	});
	messageChannel.binaryType = "arraybuffer";
	// message channel events
	{
		messageChannel.onopen = logEvent;
		messageChannel.onclose = logEvent;
		messageChannel.onerror = logEvent;
		messageChannel.onmessage = receiveMessage;
	}

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
	// TODO: make a call to createOffer()
	function getOffer() {
		return peerConnection.localDescription;
	}

	// GUEST: give the offer to the guest and get an answer
	// wrapped in a promise so that we can wait for the ice gathering to finish
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

	// TEMP: log data channel events to the console
	function logEvent(event) {
		console.log(event);
	}

	// ALL: communication functions
	function sendMessage(screenName, message) {
		messageChannel.send(JSON.stringify({ screenName, message }));
	}

	function receiveMessage(message) {
		const { timeStamp } = message;
		printMessage({ ...JSON.parse(message.data), timeStamp });
	}

	return {
		createOffer,
		getOffer,
		getAnswer,
		addAnswer,
		sendMessage,
	};
}

export default newPeerConnection;
