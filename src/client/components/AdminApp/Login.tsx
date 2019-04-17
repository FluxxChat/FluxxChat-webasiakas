/* FluxxChat-webasiakas
 * Copyright (C) 2019 Helsingin yliopisto
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import {withStyles, WithStyles, createStyles, InputBase, Theme, Button} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		padding: '1rem'
	},
	input: {
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.menu.input.background,
		padding: '0.8rem 1.6rem',
		borderRadius: '0.8rem',
		boxShadow: theme.fluxx.menu.input.shadow,
		flex: 1,
		fontSize: '1.4rem',
		boxSizing: 'border-box',
		color: 'inherit',
		transition: 'box-shadow 0.2s',
		'&$focused': {
			boxShadow: theme.fluxx.menu.input.focus.shadow
		}
	},
	button: {
		display: 'flex',
		flexDirection: 'row',
		padding: '0.8rem 1.6rem',
		borderRadius: '0.8rem',
		boxShadow: theme.fluxx.menu.input.shadow,
		flex: 1,
		fontSize: '1.4rem',
		boxSizing: 'border-box',
		background: '#09f',
		color: '#fff',
		'&:hover': {
			background: '#1af'
		}
	},
	focused: {},
	inputContainer: {
		display: 'flex',
		flexDirection: 'row',
		'&:not(:last-child)': {
			marginBottom: '1rem'
		}
	}
});

interface Props {
	onLogin: (username: string, password: string) => any;
}

interface State {
	username: string;
	password: string;
}

class Login extends React.Component<Props & WithStyles<typeof styles>, State> {
	public state = {
		username: '',
		password: ''
	};

	public handleChangeUsername = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({username: evt.target.value});
	};

	public handleChangePassword = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({password: evt.target.value});
	};

	public handleLogin = () => {
		this.props.onLogin(this.state.username, this.state.password);
	}

	public render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<div className={classes.inputContainer}>
					<InputBase
						className={classes.input}
						placeholder="Username"
						value={this.state.username}
						onChange={this.handleChangeUsername}
						autoFocus
						classes={{focused: classes.focused}}
					/>
				</div>
				<div className={classes.inputContainer}>
					<InputBase
						className={classes.input}
						placeholder="Password"
						value={this.state.password}
						onChange={this.handleChangePassword}
						classes={{focused: classes.focused}}
					/>
				</div>
				<div className={classes.inputContainer}>
					<Button	className={classes.button} onClick={this.handleLogin}>
						Login
					</Button>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Login);
