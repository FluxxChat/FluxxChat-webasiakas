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
import {Theme, createStyles, withStyles, WithStyles, InputBase, Button, InputAdornment} from '@material-ui/core';
import localeData from '../../../i18n/data.json';
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
	input: {
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.menu.input.background,
		padding: '1rem 2rem',
		borderRadius: '0.8rem',
		boxShadow: theme.fluxx.menu.input.shadow,
		flex: 1,
		fontSize: '1.6rem',
		boxSizing: 'border-box',
		color: 'inherit',
		transition: 'box-shadow 0.2s',
		'& button': {
			color: theme.fluxx.menu.button.color,
			whiteSpace: 'nowrap'
		},
		'&$focused': {
			boxShadow: theme.fluxx.menu.input.focus.shadow
		}
	},
	focused: {}
});

interface OwnProps {
	type: 'join' | 'create';
	onJoinRoom: (nickname: string) => any;
	onCreateRoom: (nickname: string) => any;
	onChangeTheme: (theme: keyof typeof themes) => void;
	onChangeLocale: (locale: keyof typeof localeData) => void;
	onChangeAvatar: (image: string) => void;
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
		const {type, onChangeTheme, intl, classes, onChangeLocale, onChangeAvatar} = this.props;

		return (
			<div className={classes.root}>
				<Header onChangeTheme={onChangeTheme} onChangeLocale={onChangeLocale} onChangeAvatar={onChangeAvatar}/>
				<div className={classes.menuContent}>
					<InputBase
						className={classes.input}
						placeholder={intl.formatMessage({id: 'input.typeNickname'})}
						onKeyDown={this.handleKeyDown}
						value={this.state.nickname}
						onChange={this.handleChangeNickname}
						autoFocus
						classes={{focused: classes.focused}}
						endAdornment={
							<InputAdornment position="end">
								<Button size="small" onClick={this.handleClickSubmit}>
									{type === 'join'
										? <FormattedMessage id="login.joinRoom"/>
										: <FormattedMessage id="login.createRoom"/>}
								</Button>
							</InputAdornment>
						}
					/>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(Menu));
