import React from 'react';
import {Message} from 'fluxxchat-protokolla';
import '../../styles.css';
import {animateScroll} from 'react-scroll';
import {Card, OwnCard} from '../Card/card';

interface Props {
	nickname: string;
	roomId: string;
	messages: Message[];
	onSendMessage: (message: string) => any;
}

interface State {
	messageDraft: string;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: ''
	};

	public componentDidMount() {
		const connection = new WebSocket(window.env.WS_API_URL || 'ws://localhost:3000');

		connection.addEventListener('open', () => {
			this.setState({connection, status: 'Connected to server'});
			this.sendMessage('System', this.props.nickname + ' has joined the chatroom');
		});

		connection.addEventListener('close', () => {
			this.setState({connection: null, status: 'Connection lost'});
		});

		connection.addEventListener('message', evt => {
			const msg: TextMessage | NewRuleMessage = JSON.parse(evt.data);
			this.setState({messages: [...this.state.messages, msg]});
			this.scrollToBottom();
		});
	}

	public scrollToBottom() {
		animateScroll.scrollToBottom({
			containerId: 'message-box'
		});
	}

	public componentWillUnmount() {
		const connection = this.state.connection;
		if (connection) {
			connection.close();
		}
	}

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		this.setState({messageDraft: ''}, () => {
			this.props.onSendMessage(messageDraft);
		});
	}

	public sendMessage = (name: string, content: string) => {
		const {connection} = this.state;
		if (connection) {
			const protocolMessage: TextMessage = {
				type: 'TEXT',
				textContent: content,
				senderNickname: name
			};
			connection.send(JSON.stringify(protocolMessage));
		}
	}

	public handleChangeMessageDraft = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({messageDraft: evt.target.value});
	}

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault(); e.stopPropagation(); this.handleSendMessage();
		}
	}

	public playCard(action: string) {
		alert(action);
	}

	public render() {
		const {messages} = this.props;
		const {messageDraft} = this.state;

		return (
			<div className="chat_app">
				<div className="chat_area">
					<div className="message_box" id="message-box">
						{messages.map((msg, index) => {
							let message;
							switch (msg.type) {
								case 'NEW_RULE':
									message = `New Rule: ${msg.ruleName}`;
									break;
								default:
									let direction = '<';
									if (msg.senderNickname === this.props.nickname) {
										direction = '>';
									}
									message = `${msg.senderNickname} ${direction} ${msg.textContent}`;
									break;
							}
							return (
								<div className="message" key={index}>{message}</div>
							);
						})}
					</div>
					<div>
						<form onKeyDown={this.handleKeyDown}>
						<input className="message_field" type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
							<div className="send_div">
								<button type="button" className="send_button" onClick={this.handleSendMessage}>Send</button>
							</div>
						</form>
					</div>
				</div >
				<div>
					<div className="turn_div">
						<div className="turn_text">
							It is someone's turn!
						</div>
					</div>
					<div className="card_div_active">
						<div className="caption">
							Active Cards
						</div>
						<Card content="this is a test" action={this.playCard}/>
					</div>
					<div className="card_div_own">
						<div className="caption">
							Your Cards
						</div>
						<OwnCard content="this is a test" action={this.playCard}/>
					</div>
				</div>
			</div>
		);
	}
}

export default ChatRoom;
