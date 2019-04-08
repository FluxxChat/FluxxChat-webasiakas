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
import {
	Card,
	TextMessage,
	CreateRoomMessage,
	JoinRoomMessage,
	Message,
	NewRuleMessage,
	User,
	ProfileImgChangeMessage,
	RuleParameters,
	SystemMessage,
	UiVariables
} from 'fluxxchat-protokolla';
import {MuiThemeProvider, createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import {get} from 'lodash';
import {hot} from 'react-hot-loader/root';
import {IntlProvider, addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import defaultMessages from '../../../i18n/data.json';
import themes from '../themes';
import ChatRoom from '../scenes/ChatRoom';
import Menu from './Menu';
import ErrorPopUp from './ErrorPopUp';
import * as sound from '../../../assets/soundeffect.mp3';

const styles = (theme: Theme) => createStyles({
	body: {
		background: theme.fluxx.body.background,
		fontSize: '1.6rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	bodyPad: {
		flex: 1,
		maxHeight: '100%'
	}
});

interface State {
	connection: WebSocket | null;
	user: User | null;
	rName: string | null;
	users: User[];
	userMap: { [key: string]: User };
	messages: Array<TextMessage | SystemMessage>;
	playableCardsLeft: number;
	ownCards: Card[];
	activeCards: Card[];
	turnUserId: string | null;
	turnTime: number;
	timer: number | null;
	messageValid: boolean;
	messageBlockingRules: string[];
	variables: UiVariables;
	locale: string;
	translatedMessages: {[key: string]: {[key: string]: string}};
	theme: keyof typeof themes;
	alert: string[];
}

interface Props {
	onChangeTheme: (theme: keyof typeof themes) => void;
}

const EMPTY_STATE: State = {
	connection: null,
	user: null,
	rName: null,
	users: [],
	userMap: {},
	messages: [],
	playableCardsLeft: 0,
	ownCards: [],
	activeCards: [],
	turnUserId: null,
	turnTime: 0,
	timer: null,
	alert: [],
	messageValid: true,
	messageBlockingRules: [],
	variables: {},
	locale: 'en',
	translatedMessages: defaultMessages,
	theme: 'light'
};

class App extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {

	public state = { ...EMPTY_STATE };

	private soundeffect = new Audio(sound);

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
					this.joinRoom(msg.roomId, this.state.rName!);
					break;
				case 'ROOM_STATE':
					if (this.state.turnUserId !== msg.turnUserId && this.state.user !== null) {
						this.soundAlert();
					}
					this.setState({
						users: msg.users,
						userMap: msg.users.reduce((m, u) => ({ ...m, [u.id]: u }), {}),
						activeCards: msg.enabledRules,
						turnUserId: msg.turnUserId,
						user: msg.users.find(u => u.id === msg.userId) || null,
						ownCards: msg.hand,
						playableCardsLeft: msg.playableCardsLeft,
						variables: msg.variables
					});
					this.startTurnTimer(msg.turnEndTime);
					break;
				case 'ERROR':
					this.setState({ alert: [...this.state.alert, msg.message] });
					break;
				case 'VALIDATE_TEXT_RESPONSE':
					this.setState({ messageValid: msg.valid });
					if (msg.invalidReason) {
						this.setState({ messageBlockingRules: msg.invalidReason });
					} else {
						this.setState({ messageBlockingRules: [] });
					}
					break;
				case 'LANGUAGE_DATA':
					this.updateLocalization(msg.messages);
				default:
					break;
			}
		});
	}

	public soundAlert = () => {
		this.soundeffect.play();
	}

	public handleSendTextMessage = (textMessage: string, imageMessage: string, audioMessage: any, respondingTo: any | null) => {
		const { connection } = this.state;
		if (connection) {
			const protocolMessage: TextMessage = {
				type: 'TEXT',
				textContent: textMessage,
				imageContent: imageMessage,
				audioContent: audioMessage,
				validateOnly: false,
				thread: respondingTo
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

	public handleChangeAvatar = (image: string) => {
		if (this.state.connection) {
			const protocolMessage: ProfileImgChangeMessage = {
				type: 'PROFILE_IMG_CHANGE',
				profileImg: image
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	}

	public joinRoom = (roomId: string, nickname: string) => {
		if (this.state.connection) {
			const protocolMessage: JoinRoomMessage = {
				type: 'JOIN_ROOM',
				roomId,
				nickname
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	}

	public requestJoinRoom = (nickname: string) => {
		const roomId = get(this.props.match, 'params.id');
		this.setState({rName: nickname}, () => this.joinRoom(roomId, nickname));
	}

	public requestCreateRoom = (nickname: string) => {
		this.setState({rName: nickname}, () => {
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
			this.setState({ turnTime: seconds });
			if (ms === 0) {
				window.clearInterval(interval);
				this.setState({ timer: null });
			}
		}, 1000);

		this.setState({ timer: interval });
	}

	public closeAlert = () => {
		this.setState({ alert: [] });
	}

	public handleValidateMessage = (message: string, image: string, audio: any) => {
		if (this.state.connection) {
			const protocolMessage: TextMessage = {
				type: 'TEXT',
				textContent: message,
				imageContent: image,
				audioContent: audio,
				validateOnly: true
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	};

	public handleChangeLocale = (newLocale: keyof typeof defaultMessages) => {
		this.setState({locale: newLocale});
	}

	public updateLocalization(translatedMessages: {[key: string]: {[key: string]: string}}) {
		const updatedMessages = this.state.translatedMessages;

		// This merges any new translations into the existing translations
		for (const locale in translatedMessages) {
			if (!translatedMessages.hasOwnProperty(locale)) { continue; }
			for (const key in translatedMessages[locale]) {
				if (translatedMessages[locale].hasOwnProperty(key)) { updatedMessages[locale][key] = translatedMessages[locale][key]; }
			}
		}
		this.setState({translatedMessages: updatedMessages});
		this.setState({locale: this.state.locale}); // this is required to get IntlProvider to reload
	}

	public render() {
		// Match contains information about the matched react-router path
		const {match, classes, onChangeTheme} = this.props;
		const {user, messages, activeCards, ownCards, playableCardsLeft, variables, locale, translatedMessages} = this.state;

		// roomId is defined if current path is something like "/room/Aisj23".
		const roomId = get(match, 'params.id');

		// loads date formats etc.
		addLocaleData(fi);
		addLocaleData(en);
		const localMessages = translatedMessages[locale];

		return (
			<IntlProvider locale={locale} key={locale} messages={localMessages}>
				<div className={classes.body}>
					<div className={classes.bodyPad}>
						{this.state.alert.length > 0 && (
							<ErrorPopUp
								onCloseAlert={this.closeAlert}
								alerts={this.state.alert}
							/>
						)}
						{(!user || !roomId) && (
							<Menu
								type={roomId ? 'join' : 'create'}
								onJoinRoom={this.requestJoinRoom}
								onCreateRoom={this.requestCreateRoom}
								onChangeTheme={onChangeTheme}
								onChangeLocale={this.handleChangeLocale}
								onChangeAvatar={this.handleChangeAvatar}
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
								playableCardsLeft={playableCardsLeft}
								onSendMessage={this.handleSendTextMessage}
								onSendNewRule={this.handleSendNewRule}
								onValidateMessage={this.handleValidateMessage}
								messageValid={this.state.messageValid}
								messageBlockingRules={this.state.messageBlockingRules}
								onChangeTheme={onChangeTheme}
								onChangeLocale={this.handleChangeLocale}
								onChangeAvatar={this.handleChangeAvatar}
								uiVariables={variables}
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
