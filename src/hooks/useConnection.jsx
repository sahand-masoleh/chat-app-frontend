import { useState, useRef } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection() {
	const [room, setRoom] = useState(null);
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const PC = useRef(newPeerConnection());

	async function join(input) {
		try {
			await socket.current.joinRoom(input);
			setRoom(input);
		} catch (error) {
			console.log(error);
		}
	}

	async function create() {
		try {
			await PC.current.createOffer();
			const nanoid = customAlphabet(
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				8
			)();
			setRoom(nanoid);
			await socket.current.createRoom(nanoid);
		} catch (error) {
			console.log(error);
		}
	}

	function getOffer(guestId) {
		const offer = PC.current.getOffer();
		socket.current.sendOffer(guestId, offer);
	}

	async function getAnswer(hostId, offer) {
		const answer = await PC.current.getAnswer(offer);
		socket.current.sendAnswer(hostId, answer);
	}

	function addAnswer(answer) {
		PC.current.addAnswer(answer);
	}

	function message(message) {
		PC.current.sendMessage(message);
	}

	return [room, join, create, message];
}

export default useConnection;
