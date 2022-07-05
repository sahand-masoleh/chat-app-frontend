import { useState, useRef } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection() {
	const [room, setRoom] = useState(null);
	const [screenName, setScreenName] = useState("");
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const PC = useRef(newPeerConnection());

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
	function handleScreenName(name) {
		if (/^[a-z0-9]{4,12}$/i) {
			setScreenName(name);
		} else {
			return new Error("invalid screen name");
		}
	}

	function sendMessage(message) {
		PC.current.sendMessage(message);
	}

	return {
		room,
		join,
		create,
		sendMessage,
		screenName,
		setScreenName: handleScreenName,
	};
}

export default useConnection;
