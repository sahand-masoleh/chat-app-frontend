import "./App.css";
import { useState } from "react";
import useConnection from "./hooks/useConnection";

function App() {
	const [room, join, create, message] = useConnection();
	const [input, setInput] = useState("");

	function handleChange(event) {
		setInput(event.target.value);
	}

	return (
		<div className="App">
			<button onClick={create}>Create Room</button>
			{room && <p>you are in room #{room}</p>}
			<hr />
			<input type="text" onChange={handleChange} value={input} />
			<button onClick={() => join(input)} disabled={input.length !== 8}>
				Join Room
			</button>
			<hr />
			<button onClick={() => message("hello bitches")}>message</button>
		</div>
	);
}

export default App;
