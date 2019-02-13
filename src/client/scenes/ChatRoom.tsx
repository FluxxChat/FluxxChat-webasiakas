import React from 'react';
import {Message, Card, RuleParameters, User} from 'fluxxchat-protokolla';
import {animateScroll} from 'react-scroll';
import {FormattedMessage} from 'react-intl';
import {ActiveCard, OwnCard} from '../components/Card';
import MessageContainer from '../components/MessageContainer';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	sendDiv: {
		margin: '5px 8px 0 0',
		float: 'right'
	},
	chatApp: {
		width: '100%',
		height: '100%',
		minWidth: '600px'
	},
	chatArea: {
		width: 'calc(60% - 5px)',
		float: 'left'
	},
	turnDiv: {
		width: 'calc(40% - 11px)',
		height: '32px',
		marginTop: '5px',
		float: 'right',
		marginRight: '14px',
		border: `1px solid ${theme.fluxx.palette.border}`
	},
	turnText: {
		margin: '6px 0 0 6px',
		fontSize: '18px',
		fontWeight: 'bold'
	},
	cardDivActive: {
		width: 'calc(40% - 11px)',
		height: 'calc(50vh - 55px)',
		margin: '5px 14px 10px 0',
		minHeight: '232px',
		float: 'right',
		overflowX: 'hidden',
		border: `1px solid ${theme.fluxx.palette.border}`
	},
	cardDivOwn: {
		width: 'calc(40% - 11px)',
		height: 'calc(50vh - 55px)',
		minHeight: '232px',
		float: 'right',
		overflowX: 'hidden',
		marginRight: '14px',
		border: `1px solid ${theme.fluxx.palette.border}`
	},
	messageBox: {
		marginTop: '5px',
		height: 'calc(100vh - 98px)',
		width: 'calc(100% - 10px)',
		minHeight: '450px',
		overflowX: 'hidden',
		border: `1px solid ${theme.fluxx.palette.border}`
	},
	inputArea: {
		display: 'flex'
	},
	messageFieldNickname: {
		flexGrow: 0,
		alignSelf: 'center'
	},
	messageField: {
		flexGrow: 1,
		maxHeight: '34px',
		marginTop: '5px',
		marginLeft: '5px',
		marginRight: '5px',
		height: '34px',
		lineHeight: '34px',
		boxSizing: 'border-box'
	},
	sendButton: {
		width: '100px',
		height: '34px',
		boxSizing: 'border-box'
	},
	caption: {
		fontSize: '17px',
		fontWeight: 'bold',
		margin: '2px 0 2px 5px'
	}
});

interface Props extends WithStyles<typeof styles> {
	nickname: string;
	roomId: string;
	users: User[];
	turnUser: User;
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
	onSendMessage: (message: string) => void;
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
}

interface State {
	messageDraft: string;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: ''
	};

	public scrollToBottom() {
		animateScroll.scrollToBottom({
			containerId: 'message-box'
		});
	}

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		this.setState({messageDraft: ''}, () => {
			this.props.onSendMessage(messageDraft);
		});
	}

	public handleChangeMessageDraft = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({messageDraft: evt.target.value});
	}

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault(); e.stopPropagation(); this.handleSendMessage();
		}
	}

	public componentDidMount() {
		this.scrollToBottom();
	}

	public componentDidUpdate() {
		this.scrollToBottom();
	}

	public render() {
		const {messages, classes} = this.props;
		const {messageDraft} = this.state;

		return (
			<div className={classes.chatApp}>
				<div className={classes.chatArea}>
					<div className={classes.messageBox} id="message-box">
						{messages.map((msg, index) => {
							return (
								<MessageContainer
									key={index}
									clientName={this.props.nickname}
									message={msg}
								/>
							);
						})}
					</div>
					<div>
						<form onKeyDown={this.handleKeyDown}>
							<div className={classes.inputArea}>
								<span className={classes.messageFieldNickname}>&lt;{this.props.nickname}&gt;</span>
								<input className={classes.messageField} type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
								<div className={classes.sendDiv}>
									<button type="button" className={classes.sendButton} onClick={this.handleSendMessage}>
										<FormattedMessage id="room.send"/>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div >
				<div>
					<div className={classes.turnDiv}>
						<div className={classes.turnText}>
							<FormattedMessage id="room.turnUser" values={{turnUser: this.props.turnUser.nickname}}/>
						</div>
					</div>
					<div className={classes.cardDivActive}>
						<div className={classes.caption}>
							<FormattedMessage id="room.activeCards"/>
						</div>
						{this.props.activeCards.map((card, index) => {
							return (
								<ActiveCard
									key={index}
									card={card}
									users={this.props.users}
								/>
							);
						})}
					</div>
					<div className={classes.cardDivOwn}>
						<div className={classes.caption}>
							<FormattedMessage id="room.hand"/>
						</div>
						{this.props.ownCards.map((card, index) => {
							return (
								<OwnCard
									key={index}
									cardId={index.toString()}
									card={card}
									users={this.props.users}
									action={this.props.onSendNewRule}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(ChatRoom);
