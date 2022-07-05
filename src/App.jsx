import "./App.css";
import { useContext } from "react";
import Wizard from "./components/Wizard";
import Chat from "./components/Chat";
import { ConnectionContext } from "./contexts/ConnectionContext";

function App() {
	const { isReady } = useContext(ConnectionContext);
	return <div className="App">{!isReady ? <Wizard /> : <Chat />}</div>;
}

export default App;
