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
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Card, TextMessage, CreateRoomMessage, JoinRoomMessage, Message, NewRuleMessage, User, RuleParameters, ValidateTextMessage} from 'fluxxchat-protokolla';
import {MuiThemeProvider, createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import {get} from 'lodash';
import {hot} from 'react-hot-loader/root';
import themes from '../themes';
import ChatRoom from '../scenes/ChatRoom';
import Menu from './Menu';
import NavigationBar from './NavBar';
import { IntlProvider, addLocaleData } from 'react-intl';
import fi = require('react-intl/locale-data/fi');
import en = require('react-intl/locale-data/en');
import localeData from '../../../i18n/data.json';
import ErrorPopUp from './ErrorPopUp';

const styles = (theme: Theme) => createStyles({
	body: {
		background: theme.fluxx.palette.body,
		fontSize: '1.6rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	bodyPad: {
		flex: 1,
		height: '100%'
	}
});

interface State {
	connection: WebSocket | null;
	user: User | null;
	users: User[];
	userMap: { [key: string]: User };
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
	turnUserId: string | null;
	turnTime: number;
	timer: number | null;
	messageValid: boolean;
	locale: string;
	theme: keyof typeof themes;
	alert: string[];
}

const EMPTY_STATE: State = {
	connection: null,
	user: null,
	users: [],
	userMap: {},
	messages: [],
	ownCards: [],
	activeCards: [],
	turnUserId: null,
	turnTime: 0,
	timer: null,
	alert: [],
	messageValid: true,
	locale: 'fi',
	theme: 'light'
};

interface Props {
	onChangeTheme: (theme: keyof typeof themes) => void;
}

class App extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
	public state: State = { ...EMPTY_STATE };

	public componentDidMount() {
		this.connect();
	}

	public componentWillUnmount() {
		const connection = this.state.connection;
		if (connection) {
			connection.close();
		}
	}

	public connect() {
		const connection = new WebSocket(window.env.WS_API_URL || 'ws://localhost:3000');

		connection.addEventListener('open', () => {
			this.setState({ connection });
		});

		connection.addEventListener('close', () => {
			this.setState(EMPTY_STATE);
			this.connect();
		});

		connection.addEventListener('message', evt => {
			const msg: Message = JSON.parse(evt.data);
			switch (msg.type) {
				case 'TEXT':
				case 'SYSTEM':
					this.setState({ messages: [...this.state.messages, msg] });
					break;
				case 'ROOM_CREATED':
					this.props.history.push(`/room/${msg.roomId}`);
					this.joinRoom(msg.roomId, this.state.nickname);
					break;
				case 'ROOM_STATE':
					this.setState({
						users: msg.users,
						userMap: msg.users.reduce((m, u) => ({ ...m, [u.id]: u }), {}),
						activeCards: msg.enabledRules,
						turnUserId: msg.turnUserId,
						nickname: msg.nickname,
						ownCards: msg.hand
						user: msg.users.find(u => u.nickname === msg.nickname) || null
					});
					this.startTurnTimer(msg.turnEndTime);
					break;
				case 'ERROR':
					this.setState({ alert: [...this.state.alert, msg.message] });
					break;
				case 'VALIDATE_TEXT_RESPONSE':
					this.setState({ messageValid: msg.valid });
					break;
				default:
					break;
			}
		});
	}

	public handleSendTextMessage = (message: string) => {
		const { connection } = this.state;
		if (connection) {
			const protocolMessage: TextMessage = {
				type: 'TEXT',
				textContent: message
			};
			connection.send(JSON.stringify(protocolMessage));
		}
	}

	public handleSendNewRule = (card: Card, ruleParameters: RuleParameters) => {
		const { connection } = this.state;
		if (connection) {
			const protocolMessage: NewRuleMessage = {
				type: 'NEW_RULE',
				ruleName: card.ruleName,
				ruleParameters
			};
			connection.send(JSON.stringify(protocolMessage));
		}
	}

	public joinRoom = (roomId: string, nickname: string | null) => {
		if (this.state.connection) {
			const protocolMessage: JoinRoomMessage = {
				type: 'JOIN_ROOM',
				roomId,
				nickname: this.state.user!.nickname
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	}

	public requestJoinRoom = (nickname: string) => {
		const roomId = get(this.props.match, 'params.id');
		this.setState(() => this.joinRoom(roomId, nickname));
	}

	public requestCreateRoom = (nickname: string) => {
		this.setState({user: {nickname, id: ''}}, () => {
			this.joinRoom(roomId);
		});
	}

	public requestCreateRoom = (nickname: string) => {
		this.setState({user: {nickname, id: ''}}, () => {
			if (this.state.connection) {
				const protocolMessage: CreateRoomMessage = { type: 'CREATE_ROOM' };
				this.state.connection.send(JSON.stringify(protocolMessage));
			}
		});
	}

	public startTurnTimer = turnEndTime => {
		if (this.state.timer) {
			window.clearInterval(this.state.timer);
		}

		const interval = window.setInterval(() => {
			const ms = Math.max(turnEndTime - Date.now(), 0);
			const seconds = Math.floor(ms / 1000);
			this.setState({turnTime: seconds});
			if (ms === 0) {
				window.clearInterval(interval);
				this.setState({timer: null});
			}
		}, 1000);

		this.setState({timer: interval});
	}

	public closeAlert = () => {
		this.setState({ alert: [] });
	}

	public handleValidateMessage = (message: string) => {
		if (this.state.connection) {
			const protocolMessage: ValidateTextMessage = {
				type: 'VALIDATE_TEXT',
				textContent: message
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	};

	public setLocale = (newLocale: string) => {
		this.setState({ locale: newLocale });
	}

	public render() {
		// Match contains information about the matched react-router path
		const {match, classes} = this.props;
		const {user, messages, activeCards: activeCards, ownCards: ownCards, locale} = this.state;

		// roomId is defined if current path is something like "/room/Aisj23".
		const roomId = get(match, 'params.id');

		// Sets up translations
		addLocaleData(fi);
		addLocaleData(en);
		const translatedMessages = (locale === 'fi') ? localeData.fi : localeData.en;

		return (
			<IntlProvider locale={locale} key={locale} messages={translatedMessages}>
				<div className={classes.body}>
					{/*<NavigationBar onChangeTheme={this.props.onChangeTheme}/>*/}
					<div className={classes.bodyPad}>
						{(!user || !roomId) && (
							<Menu
								type={roomId ? 'join' : 'create'}
								onJoinRoom={this.requestJoinRoom}
								onCreateRoom={this.requestCreateRoom}
							/>
						)}
						{user && roomId && (
							<ChatRoom
								user={user}
								roomId={roomId}
								users={this.state.users}
								turnUser={this.state.userMap[this.state.turnUserId || ''] || { nickname: '' }}
								turnTime={this.state.turnTime}
								messages={messages}
								activeCards={activeCards}
								ownCards={ownCards}
								onSendMessage={this.handleSendTextMessage}
								onSendNewRule={this.handleSendNewRule}
								onValidateMessage={this.handleValidateMessage}
								messageValid={this.state.messageValid}
							/>
						)}
					</div>
				</div>
			</IntlProvider>
		);
	}
}

const AppWithProps = withRouter(withStyles(styles)(App));

interface WrapperState {
	theme: keyof typeof themes;
}

class AppWrapper extends React.Component<{}, WrapperState> {
	public state: WrapperState = { theme: 'light' };

	public changeTheme = (theme: keyof typeof themes) => {
		this.setState({ theme });
	}

	public render() {
		return (
			<MuiThemeProvider theme={themes[this.state.theme]}>
				<AppWithProps onChangeTheme={this.changeTheme} />
			</MuiThemeProvider>
		);
	}
}

export default hot(AppWrapper);
