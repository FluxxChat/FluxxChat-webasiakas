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
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Theme, createStyles, withStyles, WithStyles, InputBase, Button, InputAdornment, TextField, ExpansionPanelSummary, ExpansionPanel, ExpansionPanelDetails } from '@material-ui/core';
import localeData from '../../../i18n/data.json';
import Header from './Header';
import themes from '../themes';
import { RoomParameters } from 'fluxxchat-protokolla';

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
	roomOptionsPanel: {
		borderRadius: '0.8rem',
		marginTop: '1rem'
	},
	focused: {}
});

const DEFAULT_TURN_LENGTH = 120; // in seconds
const DEFAULT_N_STARTING_HAND = 5;
const DEFAULT_N_DRAW = 3;
const DEFAULT_N_PLAY = 3;

interface OwnProps {
	type: 'join' | 'create';
	onJoinRoom: (nickname: string) => any;
	onCreateRoom: (nickname: string, params: RoomParameters) => any;
	onChangeTheme: (theme: keyof typeof themes) => void;
	onChangeLocale: (locale: keyof typeof localeData) => void;
	onChangeAvatar: (image: string) => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

interface State {
	nickname: string;
	roomParameters: RoomParameters;
}

class Menu extends React.Component<Props, State> {
	public state = {
		nickname: '',
		roomParameters: {} as RoomParameters
	};

	public handleClickSubmit = () => {
		if (this.props.type === 'join') {
			this.props.onJoinRoom(this.state.nickname);
		} else {
			this.props.onCreateRoom(this.state.nickname, this.state.roomParameters);
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
		this.setState({ nickname: evt.target.value });
	}

	public handleChangeTurnLength = (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams.turnLength = event.target.value;
		this.setState({roomParameters: newParams});
	}

	public handleChangeNStartingHand = (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams.nStartingHand = event.target.value;
		this.setState({roomParameters: newParams});
	}

	public handleChangeNDraw = (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams.nDraw = event.target.value;
		this.setState({roomParameters: newParams});
	}

	public handleChangeNPlay = (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams.nPlay = event.target.value;
		this.setState({roomParameters: newParams});
	}

	public render() {
		const { type, onChangeTheme, intl, classes, onChangeLocale, onChangeAvatar } = this.props;

		return (
			<div className={classes.root}>
				<Header onChangeTheme={onChangeTheme} onChangeLocale={onChangeLocale} onChangeAvatar={onChangeAvatar} />
				<div className={classes.menuContent}>
					<InputBase
						className={classes.input}
						placeholder={intl.formatMessage({ id: 'input.typeNickname' })}
						onKeyDown={this.handleKeyDown}
						value={this.state.nickname}
						onChange={this.handleChangeNickname}
						inputProps={{ maxLength: 30 }}
						autoFocus
						classes={{ focused: classes.focused }}
						endAdornment={
							<InputAdornment position="end">
								<Button size="small" onClick={this.handleClickSubmit} name="submit">
									{type === 'join'
										? <FormattedMessage id="login.joinRoom" />
										: <FormattedMessage id="login.createRoom" />}
								</Button>
							</InputAdornment>
						}
					/>
					{(this.props.type !== 'join') && (
						<ExpansionPanel className={classes.roomOptionsPanel}>
							<ExpansionPanelSummary>
								<FormattedMessage id="login.roomOptions" />
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div>
									<TextField
										label={<FormattedMessage id="login.turnLength" />}
										value={this.state.roomParameters.turnLength || DEFAULT_TURN_LENGTH}
										onChange={this.handleChangeTurnLength}
										margin="normal"
										type="number"
										fullWidth
									/>
									<TextField
										label={<FormattedMessage id="login.nStartingHand" />}
										value={this.state.roomParameters.nStartingHand || DEFAULT_N_STARTING_HAND}
										onChange={this.handleChangeNStartingHand}
										margin="normal"
										type="number"
										fullWidth
									/>
									<TextField
										label={<FormattedMessage id="login.nDraw" />}
										value={this.state.roomParameters.nDraw || DEFAULT_N_DRAW}
										onChange={this.handleChangeNDraw}
										margin="normal"
										type="number"
										fullWidth
									/>
									<TextField
										label={<FormattedMessage id="login.nPlay" />}
										value={this.state.roomParameters.nPlay || DEFAULT_N_PLAY}
										onChange={this.handleChangeNPlay}
										margin="normal"
										type="number"
										fullWidth
									/>
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						)}

				</div>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(Menu));
