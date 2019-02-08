import React from 'react';
import styles from './NavBar.scss';

interface Props {
	onChangeTheme: (theme: string) => void;
	currentTheme: string;
}

interface State {
	themes: string[];
}

class NavigationBar extends React.Component<Props, State> {

	public state: State = {
		themes: ['blue', 'light', 'red']
	};

	public render() {
		return (
			<nav className={styles.navbarBack}>
				<a className={styles.navbarFront}>FluxxChat</a>
				{this.state.themes.filter(t => ('theme-' + t) !== this.props.currentTheme).map((theme, index) => {
					return (
						<ThemeButton
							key={index}
							action={this.props.onChangeTheme}
							themeName={theme}
						/>
					);
				})}

			</nav>
		);
	}
}

interface ThemeButtonProps {
	action: (theme: string) => void;
	themeName: string;
}

export class ThemeButton extends React.Component<ThemeButtonProps> {

	public changeTheme = () => {
		this.props.action('theme-' + this.props.themeName);
	}

	public render() {
		return (
			<div className={styles.floatRight}>
				<div className={'theme-' + this.props.themeName}>
					<div className={styles.themeButtonDiv}>
						<button className={styles.themeButton} onClick={this.changeTheme}>{this.props.themeName.charAt(0).toUpperCase()}</button>
					</div>
				</div>
			</div>
		);
	}

}

export default NavigationBar;
