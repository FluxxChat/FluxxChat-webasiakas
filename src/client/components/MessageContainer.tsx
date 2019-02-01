import React from 'react';
import {Message} from 'fluxxchat-protokolla';
import '../styles.css';
import { FormattedMessage } from 'react-intl';

interface Props {
	message: Message;
	clientName: string;
}

class MessageContainer extends React.Component<Props> {

	public render() {
		const msg = this.props.message;
		switch (msg.type) {
			case 'NEW_RULE':
				return <div className="message"><FormattedMessage id="message.newRule"/>: {msg.card.name} ({msg.card.description})</div>;
			case 'TEXT':
				const direction = msg.senderNickname === this.props.clientName ? '>' : '<';
				return <div className="message">{msg.senderNickname} {direction} {msg.textContent}</div>;
			default:
				return null;
		}
	}
}

export default MessageContainer;
