import "./Toast.scss";

import { ReactComponent as WarningIcon } from "@/assets/icons/warning.svg";

function Toast({ message }) {
	return (
		<div className="toast">
			<WarningIcon className="toast__icon" title="" />
			{message}
		</div>
	);
}

export default Toast;
