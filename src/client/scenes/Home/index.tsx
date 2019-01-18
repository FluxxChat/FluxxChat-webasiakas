import React from 'react';
import {NewRuleMessage, TextMessage} from 'fluxxchat-protokolla';

interface Props {
	messages: Array<TextMessage | NewRuleMessage>;
}

const Home = ({messages}: Props) => (
	<div>
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
				<div key={index}>{message}</div>
			);
		})}
	</div>
);

export default Home;
