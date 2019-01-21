import React from 'react';
import {NewRuleMessage, TextMessage} from 'fluxxchat-protokolla';
import '../../styles.css';

interface Props {
	nickname: string;
	roomId: string;
}

interface State {
	connection: WebSocket | null;
	status: string;
	messages: Array<TextMessage | NewRuleMessage>;
	messageDraft: string;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		connection: null,
		status: '',
		messages: [],
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
		this.sendMessage(this.props.nickname, messageDraft);
		this.setState({messageDraft: ''});

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

	public render() {
		const {messages, messageDraft} = this.state;

		return (
			<div>
				<div className="message_box">
					{messages.map((msg, index) => {
						let message;
						switch (msg.type) {
							case 'NEW_RULE':
								message = `New Rule: ${msg.ruleName}`;
								break;
							default:
								message = `${msg.senderNickname} > ${msg.textContent}`;
								break;
						}
						return (
							<div className="padded_left" key={index}>{message}</div>
						);
					})}
				</div>
				<div className="padded">
					<input className="message_field" type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
					<button className="send_button" onClick={this.handleSendMessage}>Send</button>
				</div>
			</div>
		);
	}
}

export default ChatRoom;
