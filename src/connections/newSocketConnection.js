import { io } from "socket.io-client";

var socketioServer = "localhost:4000";

function newSocketConnection([getOffer, getAnswer, addAnswer]) {
	let socket = null;

	function connect() {
		return new Promise((resolve, reject) => {
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
				socket.on("new-user", (guestId) => {
					getOffer(guestId);
				});

				socket.on("sdp-offer", ([hostId, offer]) => {
					getAnswer(hostId, offer);
				});

				socket.on("sdp-answer", (answer) => {
					addAnswer(answer);
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
		try {
			await connect();
			socket.emit("create-room", room);
		} catch (error) {
			console.log(error);
		}
	}

	// GUEST: create a connection and join a room
	// will be rejected if the room is empty
	function joinRoom(room) {
		return new Promise(async (resolve, reject) => {
			try {
				await connect();
			} catch (error) {
				reject(error);
			}
			socket.emit("join-room", room, (res) => {
				if (res.success) {
					resolve();
				} else {
					reject(res.message);
				}
			});
		});
	}

	// HOST: send the SDP offer to the guest
	function sendOffer(guestId, offer) {
		socket.emit("sdp-offer", [guestId, offer]);
	}

	// GUEST: send the answer to the SDP offer back to the host
	function sendAnswer(hostId, answer) {
		socket.emit("sdp-answer", [hostId, answer]);
	}

	return { createRoom, joinRoom, sendOffer, sendAnswer };
}

export default newSocketConnection;
