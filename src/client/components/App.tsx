import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Card, TextMessage, CreateRoomMessage, JoinRoomMessage, Message, NewRuleMessage, User} from 'fluxxchat-protokolla';
import {get} from 'lodash';
import Menu from './Menu';
import ChatRoom from '../scenes/ChatRoom';
import NavigationBar from './NavBar';
import '../styles.css';

interface State {
	connection: WebSocket | null;
	nickname: string | null;
	users: User[];
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
}

class App extends React.Component<RouteComponentProps, State> {
	public state: State = {
		connection: null,
		nickname: null,
		users: [],
		messages: [],
		ownCards: [],
		activeCards: []
	};

	public componentDidMount() {
		const connection = new WebSocket(window.env.WS_API_URL || 'ws://localhost:3000');

		connection.addEventListener('open', () => {
			this.setState({connection});
		});

		connection.addEventListener('close', () => {
			this.setState({connection: null});
		});

		connection.addEventListener('message', evt => {
			const msg: Message = JSON.parse(evt.data);
			switch (msg.type) {
				case 'TEXT':
				case 'NEW_RULE':
					this.setState({messages: [...this.state.messages, msg]});
					break;
				case 'ROOM_CREATED':
					this.props.history.push(`/room/${msg.roomId}`);
					this.joinRoom(msg.roomId);
					break;
				case 'CARD':
					this.setState({ownCards: [...this.state.ownCards, msg.card]});
					break;
				case 'ROOM_STATE':
					this.setState({users: msg.users, activeCards: msg.enabledRules});
				default:
					break;
			}
		});
	}

	public componentWillUnmount() {
		const connection = this.state.connection;
		if (connection) {
			connection.close();
		}
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

	public handleSendNewRule = (card: Card) => {
		const {connection} = this.state;
		if (connection) {
			const protocolMessage: NewRuleMessage = {
				type: 'NEW_RULE',
				card
			};
			connection.send(JSON.stringify(protocolMessage));
		}
	}

	public joinRoom = (roomId: string) => {
		if (this.state.connection) {
			const protocolMessage: JoinRoomMessage = {
				type: 'JOIN_ROOM',
				roomId,
				nickname: this.state.nickname || ''
			};
			this.state.connection.send(JSON.stringify(protocolMessage));
		}
	}

	public requestJoinRoom = (nickname: string) => {
		const roomId = get(this.props.match, 'params.id');
		this.setState({nickname}, () => this.joinRoom(roomId));
	}

	public requestCreateRoom = (nickname: string) => {
		this.setState({nickname}, () => {
			if (this.state.connection) {
				const protocolMessage: CreateRoomMessage = {type: 'CREATE_ROOM'};
				this.state.connection.send(JSON.stringify(protocolMessage));
			}
		});
	}

	public render() {
		// Match contains information about the matched react-router path
		const {match} = this.props;
		const {nickname, messages, activeCards: activeCards, ownCards: ownCards} = this.state;

		// roomId is defined if current path is something like "/room/Aisj23".
		const roomId = get(match, 'params.id');

		return (
			<div>
				<NavigationBar/>
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
						messages={messages}
						activeCards={activeCards}
						ownCards={ownCards}
						onSendMessage={this.handleSendTextMessage}
						onSendNewRule={this.handleSendNewRule}
					/>
				)}
			</div>
		);
	}
}

export default withRouter(App);
