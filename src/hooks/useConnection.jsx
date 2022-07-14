import { useState, useRef, useEffect } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";

function useConnection(clientMethods) {
	const [room, setRoom] = useState(null);
	const socket = useRef(newSocketConnection([getOffer, getAnswer, addAnswer]));
	const peers = useRef({});

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
		peers.current[guestId] = newPeerConnection(clientMethods);
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
				peers.current[user] = newPeerConnection(clientMethods);
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
	function sendMessage(screenName, message) {
		for (let peer in peers.current) {
			peers.current[peer].sendMessage(screenName, message);
		}
	}

	// File Transfer
	async function sendFile(file, name) {
		try {
			const arrayBuffer = await file.arrayBuffer();
			for (let peer in peers.current) {
				peers.current[peer].sendFile(arrayBuffer, name);
			}
		} catch (error) {
			console.error(error);
		}
	}

	return { create, join, leave, room, sendMessage, sendFile };
}

export default useConnection;
