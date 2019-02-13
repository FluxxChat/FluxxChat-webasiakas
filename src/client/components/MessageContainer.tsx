import React from 'react';
import {Message} from 'fluxxchat-protokolla';
import Remarkable from 'remarkable';
import {withStyles, createStyles, WithStyles} from '@material-ui/core';

const styles = createStyles({
	message: {
		marginLeft: '5px',
		marginTop: '2px',
		display: 'flex'
	},
	messageSender: {
		flex: 0
	},
	messageContent: {
		flex: 1,
		marginLeft: '0.5em',
		'& > :first-child': {
			marginTop: '0px'
		},
		'& > :last-child': {
			marginBottom: '0px'
		}
	},
	systemMessage: {
		fontWeight: 'bold'
	}
});

interface Props extends WithStyles<typeof styles> {
	message: Message;
	clientName: string;
}

class MessageContainer extends React.Component<Props> {
	public render() {
		const {message, classes} = this.props;

		switch (message.type) {
			case 'SYSTEM':
				return (
					<div className={classes.message}>
						<span className={classes.systemMessage}>{message.message}</span>
					</div>
				);
			case 'TEXT':
				if (message.markdown) {
					const md = new Remarkable();
					return (
						<div className={classes.message}>
							<div className={classes.messageSender}>&lt;{message.senderNickname}&gt;</div>
							<div className={classes.messageContent} dangerouslySetInnerHTML={{__html: md.render(message.textContent)}}/>
						</div>
					);
				} else {
					return <div className={classes.message}>&lt;{message.senderNickname}&gt; {message.textContent}</div>;
				}
			default:
				return null;
		}
	}
}

export default withStyles(styles)(MessageContainer);
