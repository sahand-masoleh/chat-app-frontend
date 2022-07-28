import "./Top.scss";

import { useContext, useState } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";
import { ReactComponent as MenuIcon } from "@/assets/icons/menu.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/cross.svg";

import Menu from "./Menu";

function Top() {
	const { room, screenName } = useContext(ConnectionContext);
	const [isOpen, setIsOpen] = useState(false);

	function roomWithSpace(num) {
		const regex = /(\w\w?)/g;
		return num.match(regex).join(" ");
	}

	function handleMenu() {
		setIsOpen((prev) => !prev);
	}

	return (
		<div className="top">
			<div className="top__wrapper wrapper">
				<button className="top__button button" onClick={handleMenu}>
					{!isOpen ? (
						<MenuIcon className="button__svg" title="Menu Button" />
					) : (
						<CloseIcon className="button__svg" title="Menu Button" />
					)}
				</button>
				<h2 className="top__room"># {room && roomWithSpace(room)}</h2>
			</div>
			{isOpen && <Menu screenName={screenName} />}
		</div>
	);
}

export default Top;
