import React from 'react';
import styles from './NavBar.scss';

class NavigationBar extends React.Component {
	public render() {
		return (
			<nav className={styles.navbarBack}>
				<a className={styles.navbarFront}>FluxxChat</a>
			</nav>
		);
	}
}

export default NavigationBar;
