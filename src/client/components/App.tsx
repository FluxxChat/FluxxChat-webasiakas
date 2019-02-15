import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Card, TextMessage, CreateRoomMessage, JoinRoomMessage, Message, NewRuleMessage, User, RuleParameters, ValidateTextMessage} from 'fluxxchat-protokolla';
import {MuiThemeProvider, createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import {get} from 'lodash';
import themes from '../themes';
import ChatRoom from '../scenes/ChatRoom';
import Menu from './Menu';
import NavigationBar from './NavBar';
import ErrorPopUp from './ErrorPopUp';

const styles = (theme: Theme) => createStyles({
	body: {
		marginLeft: '-0.55em',
		marginTop: '-0.55em',
		width: 'calc(100vw + 0.55em)',
		height: 'calc(100vh + 0.55em)',
		background: theme.fluxx.palette.body
	},
	bodyPad: {
		marginLeft: '0.55em',
		marginTop: '0.55em'
	}
});

interface State {
	connection: WebSocket | null;
	nickname: string | null;
	users: User[];
	userMap: { [key: string]: User };
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
	turnUserId: string | null;
	turnTime: string | null;
	timer: number | null;
	messageValid: boolean;
	theme: keyof typeof themes;
	alert: string[];
}

const EMPTY_STATE: State = {
	connection: null,
	nickname: null,
	users: [],
	userMap: {},
	messages: [],
	ownCards: [],
	activeCards: [],
	turnUserId: null,
	turnTime: null,
	timer: null,
	alert: [],
	messageValid: true,
	theme: 'light'
};

interface Props {
	onChangeTheme: (theme: keyof typeof themes) => void;
}

class App extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
	public state: State = {...EMPTY_STATE};

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
			this.setState({connection});
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
					this.setState({messages: [...this.state.messages, msg]});
					break;
				case 'ROOM_CREATED':
					this.props.history.push(`/room/${msg.roomId}`);
					this.joinRoom(msg.roomId, this.state.nickname);
					break;
				case 'CARD':
					this.setState({ownCards: [...this.state.ownCards, msg.card]});
					break;
				case 'EMPTY_HAND':
					this.setState({ownCards: []});
					break;
				case 'ROOM_STATE':
					this.setState({
						users: msg.users,
						userMap: msg.users.reduce((m, u) => ({...m, [u.id]: u}), {}),
						activeCards: msg.enabledRules,
						turnUserId: msg.turnUserId,
						nickname: msg.nickname
					});
					this.startTurnTimer(msg.turnEndTime);
					break;
				case 'ERROR':
					this.setState({alert: [...this.state.alert, msg.message]});
					break;
				case 'VALIDATE_TEXT_RESPONSE':
					this.setState({messageValid: msg.valid});
					break;
				default:
					break;
			}
		});
	}

	public handleSendTextMessage = (message: string) => {
		const {connection} = this.state;
		if (connection) {
			const protocolMessage: TextMessage = {
				type: 'TEXT',
				textContent: message
			};
			connection.send(JSON.stringify(protocolMessage));
		}
	}

	public handleSendNewRule = (card: Card, ruleParameters: RuleParameters) => {
		const {connection} = this.state;
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
				nickname: nickname || ''
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	}

	public requestJoinRoom = (nickname: string) => {
		const roomId = get(this.props.match, 'params.id');
		this.setState(() => this.joinRoom(roomId, nickname));
	}

	public requestCreateRoom = (nickname: string) => {
		this.setState({nickname}, () => {
			if (this.state.connection) {
				const protocolMessage: CreateRoomMessage = {type: 'CREATE_ROOM'};
				this.state.connection.send(JSON.stringify(protocolMessage));
			}
		});
	}

	public startTurnTimer = turnEndTime => {
		if (this.state.timer) {
			clearInterval(this.state.timer);
		}
		let timer = Math.max(turnEndTime - Date.now(), 0);
		const interval = setInterval(() => {
				let seconds = Math.floor(timer / 1000);
				const minutes = Math.floor(seconds / 60);
				seconds -= minutes * 60;
				this.setState({turnTime: minutes + ' min ' + seconds + ' s'});
				if (timer > 0) {
					timer -= 1000;
				} else {
					clearInterval(interval);
					this.setState({timer: null});
				}
			}, 1000);
		this.setState({timer: interval});
	}

	public closeAlert = () => {
		this.setState({alert: []});
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

	public render() {
		// Match contains information about the matched react-router path
		const {match, classes} = this.props;
		const {nickname, messages, activeCards: activeCards, ownCards: ownCards} = this.state;

		// roomId is defined if current path is something like "/room/Aisj23".
		const roomId = get(match, 'params.id');

		return (
			<div className={classes.body}>
				<div className={classes.bodyPad}>
					<NavigationBar
						onChangeTheme={this.props.onChangeTheme}
					/>
					{this.state.alert.length > 0 && (
						<ErrorPopUp
							onCloseAlert={this.closeAlert}
							alerts={this.state.alert}
						/>
					)}
					{(!nickname || !roomId) && (
						<Menu
							type={roomId ? 'join' : 'create'}
							onJoinRoom={this.requestJoinRoom}
							onCreateRoom={this.requestCreateRoom}
						/>
					)}
					{nickname && roomId && (
						<ChatRoom
							nickname={nickname}
							roomId={roomId}
							users={this.state.users}
							turnUser={this.state.userMap[this.state.turnUserId || ''] || { nickname: '' }}
							turnTime={this.state.turnTime || ''}
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
		);
	}
}

const AppWithProps = withRouter(withStyles(styles)(App));

interface WrapperState {
	theme: keyof typeof themes;
}

class AppWrapper extends React.Component<{}, WrapperState> {
	public state: WrapperState = {theme: 'light'};

	public changeTheme = (theme: keyof typeof themes) => {
		this.setState({theme});
	}

	public render() {
		return (
			<MuiThemeProvider theme={themes[this.state.theme]}>
				<AppWithProps onChangeTheme={this.changeTheme}/>
			</MuiThemeProvider>
		);
	}
}

export default AppWrapper;
