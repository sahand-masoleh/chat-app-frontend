import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectionProvider } from "./contexts/ConnectionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ConnectionProvider>
			<App />
		</ConnectionProvider>
	</React.StrictMode>
);
