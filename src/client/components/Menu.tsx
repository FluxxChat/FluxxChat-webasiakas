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
import {FormattedMessage, injectIntl, InjectedIntlProps} from 'react-intl';
import {Theme, createStyles, withStyles, WithStyles, InputBase, Button} from '@material-ui/core';
import Header from './Header';
import themes from '../themes';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		color: theme.fluxx.text.primary
	},
	menuContent: {
		padding: '5rem',
		display: 'flex',
		flexDirection: 'column',
		width: '80vw',
		maxWidth: '50rem',
		alignSelf: 'center'
	},
	inputWrapper: {
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.menu.input.background,
		padding: '1rem 2rem',
		borderRadius: '0.8rem',
		boxShadow: '0 0 1rem 0 #0000000a',
		'& button': {
			color: theme.fluxx.menu.button.color
		}
	},
	input: {
		flex: 1,
		padding: '0 1rem',
		fontSize: '1.6rem',
		boxSizing: 'border-box',
		color: 'inherit'
	}
});

interface OwnProps {
	type: 'join' | 'create';
	onJoinRoom: (nickname: string) => any;
	onCreateRoom: (nickname: string) => any;
	onChangeTheme: (theme: keyof typeof themes) => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

interface State {
	nickname: string;
}

class Menu extends React.Component<Props, State> {
	public state = {nickname: ''};

	public handleClickSubmit = () => {
		if (this.props.type === 'join') {
			this.props.onJoinRoom(this.state.nickname);
		} else {
			this.props.onCreateRoom(this.state.nickname);
		}
	}

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this.handleClickSubmit();
		}
	}

	public handleChangeNickname = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({nickname: evt.target.value});
	}

	public render() {
		const {type, onChangeTheme, intl, classes} = this.props;

		return (
			<div className={classes.root}>
				<Header onChangeTheme={onChangeTheme}/>
				<div className={classes.menuContent}>
					<div className={classes.inputWrapper}>
						<InputBase
							className={classes.input}
							placeholder={intl.formatMessage({id: 'input.typeNickname'})}
							onKeyDown={this.handleKeyDown}
							value={this.state.nickname}
							onChange={this.handleChangeNickname}
							autoFocus
						/>
						<Button size="small" onClick={this.handleClickSubmit}>
							{type === 'join' ? <FormattedMessage id="login.joinRoom"/> : <FormattedMessage id="login.createRoom"/>}
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(Menu));
