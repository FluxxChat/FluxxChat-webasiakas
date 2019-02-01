import React from 'react';
import '../styles.css';

class NavigationBar extends React.Component {
	public render() {
		return (
			<nav className="navbar_back">
				<a className="navbar_front"> FluxxChat</a>
			</nav>
		);
	}
}

export default NavigationBar;
