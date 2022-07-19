import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectionProvider } from "./contexts/ConnectionContext";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <h1>Oh no! Something went wrong...</h1>;
		}
		return this.props.children;
	}
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ConnectionProvider>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</ConnectionProvider>
	</React.StrictMode>
);
