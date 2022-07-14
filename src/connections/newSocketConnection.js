import { io } from "socket.io-client";

// var socketioServer = "localhost:4000";
var socketioServer = "https://chat-app-signaling-server.herokuapp.com/";

function newSocketConnection([getOffer, getAnswer, addAnswer]) {
	let socket = null;

	function connect() {
		return new Promise((resolve, reject) => {
			// skip if a connection already exists
			if (socket) {
				// TODO: error message
				reject();
				return;
			}

			// establish a new connection
			socket = io(socketioServer, {
				reconnectionAttempts: 3,
			});

			// generic events
			{
				socket.on("error", (error) => console.log(error));
				socket.on("message", (message) => console.log(message));
			}

			// sdp-related events
			{
				// HOST
				socket.on("new-user", (guestId) => {
					// offer request to be sent to guestID
					getOffer(guestId);
				});

				socket.on("sdp-answer", ([guestId, answer]) => {
					// answer coming from guest
					addAnswer(guestId, answer);
				});

				socket.on("sdp-offer", ([hostId, offer]) => {
					// offer coming from hostId, requesting answer to be sent back to hostId
					getAnswer(hostId, offer);
				});
			}

			// connection events
			{
				socket.on("connect_error", (error) => {
					reject(error);
				});

				socket.on("connect", () => {
					resolve();
				});
			}
		});
	}

	// HOST: create a connection and send a create-room event to the server
	async function createRoom(room) {
		if (!socket) {
			try {
				await connect();
			} catch (error) {
				console.error(error);
			}
		}
		socket.emit("create-room", room);
	}

	// GUEST: create a connection and join a room
	// will be rejected if the room is empty
	function joinRoom(room) {
		return new Promise(async (resolve, reject) => {
			if (!socket) {
				try {
					await connect();
				} catch (error) {
					console.error(error);
				}
			}
			socket.emit("join-room", room, (res) => {
				if (res.success) {
					// resolve with array of users without self
					resolve(res.users.filter((user) => user != socket.id));
				} else {
					reject(res.message);
				}
			});
		});
	}

	function leaveRoom() {
		socket.emit("leave-room");
	}

	// HOST: send the SDP offer to the guest
	function sendOffer(guestId, offer) {
		socket.emit("sdp-offer", [guestId, offer]);
	}

	// GUEST: send the answer to the SDP offer back to the host
	function sendAnswer(hostId, answer) {
		socket.emit("sdp-answer", [hostId, answer]);
	}

	function exit() {
		console.log("unsubscribing to all events...");
		if (socket) socket.off();
	}

	return { createRoom, joinRoom, leaveRoom, sendOffer, sendAnswer, exit };
}

export default newSocketConnection;
