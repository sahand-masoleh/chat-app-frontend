import "./Toast.scss";

import { ReactComponent as WarningIcon } from "@/assets/icons/warning.svg";

function Toast({ message }) {
	return (
		<div className="toast">
			<div className="toast__icon icon">
				<WarningIcon className="icon__svg" title="" />
			</div>
			{message}
		</div>
	);
}

export default Toast;
