import React from 'react';
import {Message, TextMessage} from 'fluxxchat-protokolla';
import './MessageContainer.scss';
import { FormattedMessage } from 'react-intl';
import Remarkable from 'remarkable';

interface Props {
	message: Message;
	clientName: string;
}

class MessageContainer extends React.Component<Props> {
	public render() {
		const msg = this.props.message;
		switch (msg.type) {
			case 'NEW_RULE':
				return (
					<div className="message">
						<FormattedMessage id="message.newRule"/>!
					</div>
				);
			case 'TEXT':
				const direction = (msg as TextMessage).senderNickname === this.props.clientName ? '>' : '<';
				if (msg.markdown) {
					const md = new Remarkable();
					return <div className="message">{msg.senderNickname} {direction}<span className="message_content" dangerouslySetInnerHTML={{__html: md.render(msg.textContent)}}/></div>;
				} else {
					return <div className="message">{msg.senderNickname} {direction} {msg.textContent}</div>;
				}
			default:
				return null;
		}
	}
}

export default MessageContainer;
