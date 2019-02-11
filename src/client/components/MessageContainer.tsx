import React from 'react';
import {Message, TextMessage} from 'fluxxchat-protokolla';
import Remarkable from 'remarkable';
import {withStyles, createStyles, WithStyles} from '@material-ui/core';

const styles = createStyles({
	message: {
		marginLeft: '5px',
		marginTop: '2px'
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
				const direction = (message as TextMessage).senderNickname === this.props.clientName ? '>' : '<';
				if (message.markdown) {
					const md = new Remarkable();
					return (
						<div className={classes.message}>
							{message.senderNickname} {direction}
							<span dangerouslySetInnerHTML={{__html: md.render(message.textContent)}}/>
						</div>
					);
				} else {
					return (
						<div className={classes.message}>
							{message.senderNickname} {direction} {message.textContent}
						</div>
					);
				}
			default:
				return null;
		}
	}
}

export default withStyles(styles)(MessageContainer);
