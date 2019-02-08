import React from 'react';
import styles from './NavBar.scss';

interface Props {
	action: (theme: string) => void;
	currentTheme: string;
}

interface State {
	themes: string[];
}

class NavigationBar extends React.Component<Props, State> {

	public state: State = {
		themes: ['theme-red', 'theme-light']
	};

	public changeTheme = (theme: string) => {
		this.props.action(theme);
	}

	public render() {
		return (
			<nav className={styles.navbarBack}>
				<a className={styles.navbarFront}>FluxxChat</a>
				{this.state.themes.map((theme, index) => {
					if (theme !== this.props.currentTheme) {
						return (
							<ThemeButton
								key={index}
								action={this.changeTheme}
								themeName={theme}
							/>
						);
					}
				})}

			</nav>
		);
	}
}

interface ThemeButtonProps {
	action: (theme: string) => void;
	themeName: string;
}

class ThemeButton extends React.Component<ThemeButtonProps> {

	public changeTheme = () => {
		this.props.action(this.props.themeName);
	}

	public render() {
		return (
			<div className={styles.themeButtonDiv}>
				<button className={styles.themeButton} onClick={this.changeTheme}/>
			</div>
		);
	}

}

export default NavigationBar;
