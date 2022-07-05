import { useState, useRef } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection({ printMessage }) {
	const [room, setRoom] = useState(null);
	const [screenName, setScreenName] = useState("");
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const PC = useRef(newPeerConnection({ printMessage }));

	// HOST
	async function create() {
		try {
			await PC.current.createOffer();
			const nanoid = customAlphabet(
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				8
			)();
			await socket.current.createRoom(nanoid);
			setRoom(nanoid);
		} catch (error) {
			console.log(error);
		}
	}

	function getOffer(guestId) {
		const offer = PC.current.getOffer();
		socket.current.sendOffer(guestId, offer);
	}

	function addAnswer(answer) {
		PC.current.addAnswer(answer);
	}

	// GUEST
	async function join(input) {
		try {
			await socket.current.joinRoom(input);
			setRoom(input);
		} catch (error) {
			console.log(error);
		}
	}

	async function getAnswer(hostId, offer) {
		const answer = await PC.current.getAnswer(offer);
		socket.current.sendAnswer(hostId, answer);
	}

	// Communication
	function sendMessage(screenName, message) {
		PC.current.sendMessage(screenName, message);
	}

	return {
		room,
		join,
		create,
		sendMessage,
		screenName,
		setScreenName,
	};
}

export default useConnection;
