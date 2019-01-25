import React from 'react';
import {Message} from 'fluxxchat-protokolla';

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

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		this.setState({messageDraft: ''}, () => {
			this.props.onSendMessage(messageDraft);
		});
	}

	public handleChangeMessageDraft = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({messageDraft: evt.target.value});
	}

	public render() {
		const {messages} = this.props;
		const {messageDraft} = this.state;

		return (
			<div>
				{messages.map((msg, index) => {
					let message;
					switch (msg.type) {
						case 'NEW_RULE':
							message = `New Rule: ${msg.ruleName}`;
							break;
						case 'TEXT':
							message = `${msg.senderNickname} > ${msg.textContent}`;
							break;
						default:
							return null;
					}

					return (
						<div key={index}>{message}</div>
					);
				})}
				<input type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
				<button onClick={this.handleSendMessage}>Send</button>
			</div>
		);
	}
}

export default ChatRoom;
