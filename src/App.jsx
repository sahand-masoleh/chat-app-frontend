import "./App.css";
import { useState } from "react";
import useConnection from "./hooks/useConnection";
import Wizard from "./components/Wizard";
import Chat from "./components/Chat";

function App() {
	const { room, join, create, sendMessage, screenName, setScreenName } =
		useConnection();
	const [isReady, setIsReady] = useState(false);

	return (
		<div className="App">
			{!isReady ? (
				<Wizard
					create={create}
					join={join}
					room={room}
					screenName={screenName}
					setScreenName={setScreenName}
					setIsReady={setIsReady}
				/>
			) : (
				<Chat room={room} screenName={screenName} sendMessage={sendMessage} />
			)}
		</div>
	);
}

export default App;
