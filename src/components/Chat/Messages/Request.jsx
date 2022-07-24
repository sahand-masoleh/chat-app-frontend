import { useState, useContext } from "react";

import { ConnectionContext } from "@/contexts/ConnectionContext";

import fileSize from "filesize";

import BEM from "@/utils/BEM";

import { ReactComponent as CheckmarkIcon } from "@/assets/icons/checkmark.svg";
import { ReactComponent as CrossIcon } from "@/assets/icons/cross.svg";
import { ReactComponent as DocumentIcon } from "@/assets/icons/document.svg";
import { ReactComponent as SaveIcon } from "@/assets/icons/save.svg";

function Request({ dir, request, name, size, timeStamp }) {
	// status = null | refused | [percentage] | ready | failed
	// TODO: failed
	const [status, setStatus] = useState(null);
	const { downloadList } = useContext(ConnectionContext);

	function handleAccept() {
		request.accept(timeStamp);
		downloadList.current[timeStamp] = 0;
		setStatus(0);

		// TODO: ability to cancel
		let intervalId;
		const checkStatus = () => downloadList.current[timeStamp];
		intervalId = setInterval(() => {
			const status = checkStatus();
			if (typeof status == "number") {
				setStatus((status / size) * 100);
			} else if (typeof status == "string") {
				setStatus("ready");
				clearInterval(intervalId);
			} else {
				setStatus("failed");
				clearInterval(intervalId);
			}
		}, 100);
	}

	function handleRefuse() {
		request.refuse();
		setStatus("refused");
		delete downloadList.current[timeStamp];
	}

	function handleDownload() {
		const url = downloadList.current[timeStamp];
		const a = document.createElement("a");
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
		delete downloadList.current[timeStamp];
	}

	return (
		<div className={BEM("file-message", "", dir, status)}>
			<div className={`${BEM("file-message", "icon", dir)} icon`}>
				<DocumentIcon className="icon__svg" title="" />
			</div>
			<div className="file-message__info">
				<p className="file-message__name">{name}</p>
				<p className="file--message__size">{fileSize(size)}</p>
			</div>
			{dir === "in" &&
				(!status ? (
					<div className="file-message__button-cont">
						<button
							className={`${BEM("file-message", "button", "green")} button`}
							onClick={handleAccept}
						>
							<CheckmarkIcon className="button__svg" title="Accept File" />
						</button>
						<button
							className={`${BEM("file-message", "button", "red")} button`}
							onClick={handleRefuse}
						>
							<CrossIcon className="button__svg" title="Refuse File" />
						</button>
					</div>
				) : status === "ready" ? (
					<div className="file-message__button-cont">
						<button
							className={`${BEM("file-message", "button")} button`}
							onClick={handleDownload}
						>
							<SaveIcon className="button__svg" title={"Save File"} />
						</button>
					</div>
				) : typeof status === "number" ? (
					<div className="file-message__button-cont">
						<div
							className="file-message__loading"
							style={{ "--percentage": status }}
						>
							{status.toFixed(2)}%
						</div>
					</div>
				) : null)}
		</div>
	);
}

export default Request;
