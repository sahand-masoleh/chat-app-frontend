import * as dataChannel from "./dataChannel";
import setupTextChannel from "./setupTextChannel";

const iceServers = {
	iceServers: [
		{
			urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
		},
	],
};

async function newPeerConnection(hookMethods) {
	let peerConnection = new RTCPeerConnection(iceServers);

	//TODO: handle connection events
	// peerConnection.onicecandidateerror = (error) => {
	// 	console.error(error);
	// 	hookMethods.setError();
	// };
	// peerConnection.onconnectionstatechange = (e) =>
	// 	console.log({ connectionState: e.target.connectionState });
	// peerConnection.oniceconnectionstatechange = (e) =>
	// 	console.log({ iceConnectionState: e.target.iceConnectionState });
	// peerConnection.onicegatheringstatechange = (e) =>
	// 	console.log({ iceGatheringState: e.target.iceGatheringState });
	// peerConnection.onsignalingstatechange = (e) =>
	// 	console.log({ signalingState: e.target.signalingState });

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

	/** TEXT CHANNEL */

	const textChannel = peerConnection.createDataChannel("text-channel", {
		negotiated: true,
		id: 100,
	});
	const { sendText } = setupTextChannel(textChannel, hookMethods);

	/** FILE TRANSFER EVENTS & FUNCTIONS */

	// RECEIVER
	peerConnection.ondatachannel = (event) => {
		const { channel } = event;
		dataChannel.receive(channel, hookMethods);
	};

	// SENDER
	function sendFile(arrayBuffer, info) {
		const channel = peerConnection.createDataChannel("data-channel");
		dataChannel.send(channel, arrayBuffer, info);
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
