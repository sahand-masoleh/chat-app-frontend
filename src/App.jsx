import "./App.scss";
import { useContext } from "react";
import { Component } from "react";
import Wizard from "./components/Wizard";
import Chat from "./components/Chat";
import { ConnectionContext } from "./contexts/ConnectionContext";

function App() {
	const { isReady } = useContext(ConnectionContext);
	return <>{!isReady ? <Wizard /> : <Chat />}</>;
}

export default App;
