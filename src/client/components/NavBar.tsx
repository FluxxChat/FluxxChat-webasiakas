import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import themes, {themeNames} from '../themes';

const styles = (theme: Theme) => createStyles({
	navbarBack: {
		height: '31px',
		padding: '7px',
		marginLeft: '-0.55em',
		marginTop: '-0.55em',
		marginBottom: '3px',
		background: theme.fluxx.palette.primary
	},
	navbarFront: {
		fontSize: '25px',
		color: theme.fluxx.palette.contrast
	},
	dropdownContent: {
		display: 'none',
		position: 'absolute',
		backgroundColor: '#f1f1f1',
		width: '70px',
		boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
		zindex: '1'
	},
	dropDown: {
		marginRight: '5px',
		position: 'relative',
		display: 'inline-block',
		'&:hover $dropdownContent': {
			display: 'block'
		},
		'&:hover $dropBtn': {
			backgroundColor: theme.fluxx.palette.themeButtonHover
		}
	},
	dropBtn: {
		height: '31px',
		backgroundColor: theme.fluxx.palette.themeButton,
		color: 'white',
		border: 'none',
		width: '70px',
		fontWeight: 'bold'
	},
	themeButton: {
		backgroundColor: 'transparent',
		outlineColor: 'transparent',
		borderColor: 'transparent',
		outline: 'none',
		border: '0',
		width: '70px',
		'&:hover': {
			backgroundColor: theme.fluxx.palette.themeSelectButtonHover
		}
	},

	floatRight: {
		float: 'right'
	}
});

interface Props {
	onChangeTheme: (theme: keyof typeof themes) => void;
}

class NavigationBar extends React.Component<Props & WithStyles<typeof styles>> {

	public render() {
		const {classes} = this.props;

		return(
			<nav className={classes.navbarBack}>
				<a className={classes.navbarFront}>FluxxChat</a>
				<div className={classes.floatRight}>
					<div className={classes.dropDown}>
						<button className={classes.dropBtn}>Theme</button>
						<div className={classes.dropdownContent}>
							{themeNames.map((theme, index) => {
								return (
									<ThemeButton
										key={index}
										onChangeTheme={this.props.onChangeTheme}
										theme={theme}
										classes={classes}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
const NavBarWithProps = withStyles(styles)(NavigationBar);

interface ThemeButtonProps {
	classes;
	onChangeTheme: (theme: string) => void;
	theme: string;
}

class ThemeButton extends React.Component<ThemeButtonProps> {

	public changeTheme = () => {
		this.props.onChangeTheme(this.props.theme.toLowerCase());
	}

	public render() {
		const {classes} = this.props;
		return(
			<button className={classes.themeButton} onClick={this.changeTheme}>{this.props.theme}</button>
		);
	}

}

export default NavBarWithProps;
