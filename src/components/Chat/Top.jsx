import "./Top.scss";

import { useContext, useState } from "react";
import { ConnectionContext } from "@/contexts/ConnectionContext";
import { ReactComponent as MenuIcon } from "@/assets/icons/menu.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/cross.svg";
import { ReactComponent as DarkIcon } from "@/assets/icons/dark.svg";
import { ReactComponent as LightIcon } from "@/assets/icons/light.svg";

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
				<h2 className="top__room">{room && roomWithSpace(room)}</h2>
			</div>
			{isOpen && <Menu screenName={screenName} />}
		</div>
	);
}

export default Top;

function Menu({ screenName }) {
	const { leave } = useContext(ConnectionContext);
	const [isDark, setIsDark] = useState(false);

	function handleTheme() {
		setIsDark((prev) => !prev);
	}

	function handleLeave() {
		leave();
	}

	return (
		<div className="menu" data-menu>
			<p className="menu__title">Display Name:</p>
			<p className="menu__item">@{screenName}</p>

			<hr className="menu__divider" />

			<div className="menu__theme" onClick={handleTheme}>
				<button className="menu__button button">
					<DarkIcon className="button__svg" title="Dark Mode" />
				</button>
				<button className="menu__button  button">
					<LightIcon className="button__svg" title="Light Mode" />
				</button>
			</div>

			<hr className="menu__divider" />

			<p className="menu__item" onClick={handleLeave}>
				Exit Room
			</p>
		</div>
	);
}
