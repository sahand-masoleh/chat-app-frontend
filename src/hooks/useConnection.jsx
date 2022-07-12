import { useState, useRef, useEffect } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection(printMessage) {
	const [room, setRoom] = useState(null);
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const peers = useRef({});

	// HOST
	async function create() {
		try {
			const nanoid = customAlphabet(
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
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
		peers.current[guestId] = newPeerConnection(printMessage);
		await peers.current[guestId].createOffer();
		const offer = peers.current[guestId].getOffer();
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
				peers.current[user] = newPeerConnection(printMessage);
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

	// Communication
	function sendMessage(screenName, message) {
		for (let peer in peers.current) {
			peers.current[peer].sendMessage(screenName, message);
		}
	}

	return { create, join, room, sendMessage };
}

export default useConnection;
