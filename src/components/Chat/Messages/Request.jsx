import { useState, useContext } from "react";

import { ConnectionContext } from "@/contexts/ConnectionContext";

import fileSize from "filesize";

import BEM from "@/utils/BEM";

// TODO: aria-label
import { ReactComponent as CheckmarkIcon } from "@/assets/icons/checkmark.svg";
import { ReactComponent as CrossIcon } from "@/assets/icons/cross.svg";
import { ReactComponent as DocumentIcon } from "@/assets/icons/document.svg";
import { ReactComponent as SaveIcon } from "@/assets/icons/save.svg";

function Request({ dir, request, name, size, timeStamp }) {
	const [status, setStatus] = useState(null);
	const { downloadList } = useContext(ConnectionContext);

	function handleAccept() {
		request.accept(timeStamp);
	}

	function handleRefuse() {
		request.refuse();
		setStatus("refused");
	}

	function handleDownload() {
		const url = downloadList.current[timeStamp];
		console.log(typeof url);
		const a = document.createElement("a");
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
	}

	return (
		<div className={BEM("file-message", "", dir, status)}>
			<DocumentIcon className="file-message__icon" />
			<div className="file-message__info">
				<p className="file-message__name">{name}</p>
				<p className="file--message__size">{fileSize(size)}</p>
			</div>
			{!status ? (
				<div className="file-message__button-cont">
					<button
						className={`${BEM("file-message", "button", "green")} button`}
						onClick={handleAccept}
					>
						<CheckmarkIcon className="button__svg" />
					</button>
					<button
						className={`${BEM("file-message", "button", "red")} button`}
						onClick={handleRefuse}
					>
						<CrossIcon className="button__svg" />
					</button>
				</div>
			) : status === "accepted" ? (
				<div className="file-message__button-cont">
					<button
						className={`${BEM("file-message", "button")} button`}
						onClick={handleDownload}
					>
						<SaveIcon className="button__svg" />
					</button>
				</div>
			) : null}
		</div>
	);
}

export default Request;
