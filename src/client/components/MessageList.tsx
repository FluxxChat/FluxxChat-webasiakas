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
import {User, TextMessage, SystemMessage} from 'fluxxchat-protokolla';
import {animateScroll} from 'react-scroll';
import {withStyles, createStyles, WithStyles} from '@material-ui/core';
import PlayerTextMessage from './PlayerTextMessage';
import SystemTextMessage from './SystemTextMessage';

const styles = createStyles({
	root: {
		overflowX: 'hidden',
		overflowY: 'auto',
		flex: 1,
		padding: '1rem',
		fontSize: '1.2rem'
	}
});

interface Props extends WithStyles<typeof styles> {
	messages: Array<TextMessage | SystemMessage>;
	clientUser: User;
}

class MessageList extends React.Component<Props> {
	public scrollToBottom() {
		animateScroll.scrollToBottom({
			containerId: 'message-box',
			duration: 100
		});
	}

	public componentDidMount() {
		this.scrollToBottom();
	}

	public componentDidUpdate() {
		const el = document.getElementById('message-box');
		if (el && el.scrollTop === (el.scrollHeight - el.offsetHeight)) {
			this.scrollToBottom();
		}
	}

	public render() {
		const {messages, classes, clientUser} = this.props;

		return (
			<div className={classes.root} id="message-box">
				{messages.map((message, index) => {
					switch (message.type) {
						case 'SYSTEM':
						return <SystemTextMessage key={index} message={message}/>;
						case 'TEXT':
							return (
								<PlayerTextMessage
									key={index}
									message={message}
									previousMessage={messages[index - 1]}
									clientUser={clientUser}
								/>
							);
						default:
							return null;
					}
				})}
			</div>
		);
	}
}

export default withStyles(styles)(MessageList);
