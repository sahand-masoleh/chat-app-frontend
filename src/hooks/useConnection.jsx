import { useState, useRef, useContext } from "react";
import { customAlphabet } from "nanoid";

import newPeerConnection from "../connections/newPeerConnection";
import newSocketConnection from "../connections/newSocketConnection";
import { StatusContext } from "../contexts/StatusContext";

function useConnection(clientMethods) {
	const { setIsLoading, setError } = useContext(StatusContext);
	const [room, setRoom] = useState(null);
	const socket = useRef(
		newSocketConnection({ getOffer, getAnswer, addAnswer, setError })
	);
	const peers = useRef({});

	const hookMethods = {
		receiveText: clientMethods.handleText,
		receiveFile,
		receiveFileRequest: clientMethods.handleFileRequest,
		setError,
		// receiveImage,
		// receiveVoice
	};

	// HOST
	async function create() {
		setIsLoading(true);
		try {
			const nanoid = customAlphabet(
				// "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
				"1234567890",
				8
			)();
			await socket.current.createRoom(nanoid);
			setRoom(nanoid);
		} catch (error) {
			setError(error);
		}
		setIsLoading(false);
	}

	// TODO: change name
	async function getOffer(guestId) {
		// add new user to the collection of users
		peers.current[guestId] = await newPeerConnection(hookMethods);
		// TODO: try catch
		const offer = await peers.current[guestId].getOffer();
		socket.current.sendOffer(guestId, offer);
	}

	function addAnswer(guestId, answer) {
		peers.current[guestId].addAnswer(answer);
	}

	// GUEST
	async function join(input) {
		setIsLoading(true);
		try {
			let users = await socket.current.joinRoom(input);
			// create a collection of already connected users
			for (let user of users) {
				peers.current[user] = await newPeerConnection(hookMethods);
			}
			setRoom(input);
		} catch (error) {
			setError(error);
		}
		setIsLoading(false);
	}

	// TODO: change name
	async function getAnswer(hostId, offer) {
		try {
			const answer = await peers.current[hostId].getAnswer(offer);
			socket.current.sendAnswer(hostId, answer);
		} catch (error) {
			setError("unable to connect to new peer");
		}
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

	// File Transfer
	async function sendFile(file, info) {
		try {
			const arrayBuffer = await file.arrayBuffer();
			for (let peer in peers.current) {
				peers.current[peer].sendFile(arrayBuffer, info);
			}
		} catch (error) {
			console.error(error);
			setError("could not read the file");
		}
	}

	function receiveFile(downloaded, timeStamp, arrayBuffer) {
		if (downloaded === "done") {
			try {
				const blob = new Blob([arrayBuffer]);
				clientMethods.handleFile(downloaded, timeStamp, blob);
			} catch (error) {
				console.error(error);
				setError("file corrupted");
			}
		} else clientMethods.handleFile(downloaded, timeStamp);
	}

	return { create, join, leave, room, sendText, sendFile };
}

export default useConnection;
