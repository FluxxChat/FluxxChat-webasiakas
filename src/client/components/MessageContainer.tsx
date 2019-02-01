import React from 'react';
import {Message} from 'fluxxchat-protokolla';
import '../styles.css';

interface Props {
	message: Message;
	clientName: string;
}

class MessageContainer extends React.Component<Props> {

	public render() {
		let message;
		const msg = this.props.message;
		switch (msg.type) {
			case 'NEW_RULE':
				message = `New Rule: ${msg.card.ruleName}`;
				break;
			case 'TEXT':
				const direction = msg.senderNickname === this.props.clientName ? '>' : '<';
				message = `${msg.senderNickname} ${direction} ${msg.textContent}`;
				break;
			default:
				return null;
		}
		return (
			<div className="message">{message}</div>
		);
	}
}

export default MessageContainer;
