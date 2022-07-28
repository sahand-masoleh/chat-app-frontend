import "./Menu.scss";

import { useContext } from "react";

import { ConnectionContext } from "@/contexts/ConnectionContext";
import { ThemeContext } from "@/contexts/ThemeContext";

import { ReactComponent as DarkIcon } from "@/assets/icons/dark.svg";
import { ReactComponent as LightIcon } from "@/assets/icons/light.svg";

function Menu({ screenName }) {
	const { leave } = useContext(ConnectionContext);
	const { isDark, changeTheme } = useContext(ThemeContext);

	function handleLeave() {
		leave();
	}

	return (
		<div className="menu" data-menu>
			<p className="menu__title">Display Name:</p>
			<p className="menu__item">@{screenName}</p>

			<hr className="menu__divider" />

			<div className="menu__theme" onClick={changeTheme}>
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

export default Menu;
