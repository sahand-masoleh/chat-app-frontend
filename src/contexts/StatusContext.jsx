import { createContext, useState } from "react";

import Loading from "@/components/Status/Loading";
import Toast from "@/components/Status/Toast";

export const StatusContext = createContext();

const ERROR_DURATION = 5000;

export function StatusProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	//TODO: remove loading after timeout with useEffect

	function setErrorProp(error) {
		setIsLoading(false);
		if (error) {
			setError(error);
		} else {
			setError("conenction error");
		}
		setTimeout(() => {
			setError(false);
		}, ERROR_DURATION);
	}

	return (
		<StatusContext.Provider value={{ setIsLoading, setError: setErrorProp }}>
			{error ? <Toast message={error} /> : isLoading ? <Loading /> : null}
			{children}
		</StatusContext.Provider>
	);
}
