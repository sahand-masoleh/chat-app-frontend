import { useState, useRef } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection(clientMethods) {
	const [room, setRoom] = useState(null);
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const peers = useRef({});

	const hookMethods = {
		receiveText,
		receiveFile,
		receiveFileRequest,
		// receiveImage,
		// receiveVoice
	};

	// HOST
	async function create() {
		try {
			const nanoid = customAlphabet(
				// "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				"1234567890",
				8
			)();
			await socket.current.createRoom(nanoid);
			setRoom(nanoid);
		} catch (error) {
			console.error(error);
		}
	}

	async function getOffer(guestId) {
		// add new user to the collection of users
		peers.current[guestId] = newPeerConnection(hookMethods);
		const offer = await peers.current[guestId].getOffer();
		socket.current.sendOffer(guestId, offer);
	}

	function addAnswer(guestId, answer) {
		peers.current[guestId].addAnswer(answer);
	}

	// GUEST
	async function join(input) {
		try {
			let users = await socket.current.joinRoom(input);
			// create a collection of already connected users
			for (let user of users) {
				peers.current[user] = newPeerConnection(hookMethods);
			}
			setRoom(input);
		} catch (error) {
			console.error(error);
		}
	}

	async function getAnswer(hostId, offer) {
		const answer = await peers.current[hostId].getAnswer(offer);
		socket.current.sendAnswer(hostId, answer);
	}

	// ALL
	function leave() {
		setRoom(null);
		socket.current.leaveRoom();
	}

	// Communication
	function sendText(text, sender) {
		for (let peer in peers.current) {
			peers.current[peer].sendText(text, sender);
		}
	}

	function receiveText(text, sender, timeStamp) {
		clientMethods.handleText(text, sender, timeStamp);
	}

	// File Transfer
	async function sendFile(file, info) {
		try {
			const arrayBuffer = await file.arrayBuffer();
			for (let peer in peers.current) {
				peers.current[peer].sendFile(arrayBuffer, info);
			}
		} catch (error) {
			console.error(error);
		}
	}

	function receiveFile(arrayBuffer, name) {
		try {
			const blob = new Blob([arrayBuffer]);
			clientMethods.handleFile(blob, name);
		} catch (error) {
			console.error(error);
		}
	}

	function receiveFileRequest(request, info) {
		clientMethods.handleFileRequest(request, info);
	}

	return { create, join, leave, room, sendText, sendFile };
}

export default useConnection;
