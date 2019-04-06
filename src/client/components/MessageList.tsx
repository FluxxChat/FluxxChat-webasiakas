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
import {User, TextMessage, SystemMessage, UiVariables} from 'fluxxchat-protokolla';
import {withStyles, createStyles, WithStyles} from '@material-ui/core';
import ScrollArea from 'react-scrollbar';
import PlayerTextMessage from './PlayerTextMessage';
import SystemTextMessage from './SystemTextMessage';

const styles = createStyles({
	root: {
		flex: 1,
		fontSize: '1.2rem'
	},
	scrollContent: {
		padding: '1rem'
	}
});

interface Props extends WithStyles<typeof styles> {
	messages: Array<TextMessage | SystemMessage>;
	clientUser: User;
	variables: UiVariables;
	respondingTo: {senderId: string, timestamp: string} | null;
	onToggleThread: (senderId: string, senderNickname: string, timestamp: string) => void;
}

interface State {
	scrolledToBottom: boolean;
	currentlyOpenThread: {senderId: string, timestamp: string} | null;
}

class MessageList extends React.Component<Props, State> {
	public state: State = {scrolledToBottom: true, currentlyOpenThread: null};

	public scrollAreaRef = React.createRef<any>();

	public scrollToBottom() {
		window.setTimeout(() => this.scrollAreaRef.current.scrollBottom(), 0);
	}

	public componentDidMount() {
		this.scrollToBottom();
	}

	public componentDidUpdate(prevProps: Props) {
		if (prevProps.messages.length !== this.props.messages.length && this.state.scrolledToBottom) {
			this.scrollToBottom();
		}
		if (prevProps.respondingTo !== this.props.respondingTo && !this.props.respondingTo) {
			this.setState({currentlyOpenThread: this.props.respondingTo});
		}
	}

	public handleScroll = (obj: any) => {
		if (obj.realHeight && obj.containerHeight && obj.topPosition) {
			const scrolledToBottom = obj.topPosition === obj.realHeight - obj.containerHeight;
			if (this.state.scrolledToBottom !== scrolledToBottom) {
				this.setState({scrolledToBottom});
			}
		}
	}

	public onToggleThread = (senderId: string, senderNickname: string, timestamp: string) => {
		if (senderId === '' &&  senderNickname === '' && timestamp === '') {
			this.setState({currentlyOpenThread: null});
		} else {
			this.setState({currentlyOpenThread: {senderId, timestamp}});
		}
		this.props.onToggleThread(senderId, senderNickname, timestamp);
	}
                             
	public shouldComponentUpdate(props: Props) {
		return this.props.messages.length !== props.messages.length;
	}

	public render() {
		const {messages, classes, clientUser, variables} = this.props;
		const {currentlyOpenThread} = this.state;

		const responses: { [key: string]: TextMessage[] } = {};
		messages.filter((message: TextMessage) => message.thread).forEach((message: TextMessage) => {
			if (message.thread) {
				const key = message.thread.senderId + message.thread.timestamp;
				if (!responses[key]) {
					responses[key] = [];
				}
				responses[key].push(message);
			}
		});

		return (
			<ScrollArea
				ref={this.scrollAreaRef}
				className={classes.root}
				contentClassName={`${classes.scrollContent} messages`}
				onScroll={this.handleScroll}
				horizontal={false}
			>
				{messages.map((message, index) => {
					switch (message.type) {
						case 'SYSTEM':
						return <SystemTextMessage key={index} message={message}/>;
						case 'TEXT':
							if (message.senderId && message.timestamp && !message.thread) {
								return (
									<PlayerTextMessage
										key={message.senderId + message.timestamp}
										message={message}
										previousMessage={messages[index - 1]}
										clientUser={clientUser}
										threads={variables.threads ? variables.threads : false}
										responses={responses[message.senderId + message.timestamp]}
										threadOpen={(
											(variables.threads || responses[message.senderId + message.timestamp])
											&& currentlyOpenThread
											&& currentlyOpenThread.senderId === message.senderId
											&& currentlyOpenThread.timestamp === message.timestamp
										) ? true : false}
										onToggleThread={this.onToggleThread}
									/>
								);
							}
						default:
							return null;
					}
				})}
			</ScrollArea>
		);
	}
}

export default withStyles(styles)(MessageList);
