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
import {Message, Card, RuleParameters, User} from 'fluxxchat-protokolla';
import {animateScroll} from 'react-scroll';
import {FormattedMessage} from 'react-intl';
import {ActiveCard, OwnCard} from '../components/Card';
import MessageContainer from '../components/MessageContainer';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	sendDiv: {},
	header: {
		fontSize: '1.4rem',
		fontWeight: 500,
		flex: '0 0 5rem',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: '0 2rem',
		backgroundColor: '#ffffff44',
		borderBottom: '1px solid #00000011'
	},
	chatApp: {
		width: '100%',
		height: '100%',
		display: 'flex'
	},
	chatArea: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column'
	},
	controlArea: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.fluxx.palette.foreground,
		'& > $header': {
			justifyContent: 'flex-end',
			padding: '0 2rem'
		}
	},
	themeButton: {
		border: 'none',
		background: 'transparent',
		fontWeight: 600,
		color: '#444',
		textTransform: 'uppercase'
	},
	cardDivActive: {
		flex: 1,
		margin: '0 1rem',
		borderBottom: '1px solid #00000011'
	},
	cardDivOwn: {
		flex: 1,
		margin: '0 1rem'
	},
	cardList: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	messageBox: {
		overflowX: 'hidden',
		flex: 1,
		borderRadius: theme.fluxx.borderRadius,
		padding: '1rem',
		fontFamily: 'Roboto Mono, monospace',
		fontSize: '1.1rem'
	},
	inputArea: {
		marginTop: '1rem',
		padding: '1rem',
		display: 'flex',
		alignItems: 'center'
	},
	messageFieldNickname: {
		flexGrow: 0,
		alignSelf: 'center'
	},
	valid: {},
	messageFieldDiv: {
		flex: 1,
		display: 'flex',
		position: 'relative'
	},
	messageField: {
		flex: 1,
		height: '34px',
		lineHeight: '34px',
		boxSizing: 'border-box',
		':not($valid) > &': {
			backgroundColor: '#ffee00aa'
		}
	},
	messageFieldWarning: {
		flex: '0 0 auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '4px 8px',
		position: 'absolute',
		top: 0,
		right: 0,
		boxSizing: 'border-box',
		height: '100%',
		backgroundColor: '#ff000022',
		'$valid > &': {
			display: 'none'
		}
	},
	sendButton: {
		width: '100px',
		height: '34px',
		boxSizing: 'border-box'
	},
	caption: {
		fontSize: '1.6rem',
		fontWeight: 600,
		margin: '2rem 0.4rem'
	}
});

interface Props extends WithStyles<typeof styles> {
	nickname: string;
	roomId: string;
	users: User[];
	turnUser: User;
	turnTime: string;
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
	messageValid: boolean;
	onSendMessage: (message: string) => void;
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
	onValidateMessage: (message: string) => void;
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
		if (this.props.messageValid) {
			const {messageDraft} = this.state;
			this.setState({messageDraft: ''}, () => {
				this.props.onSendMessage(messageDraft);
			});
		}
	}

	public handleChangeMessageDraft = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({messageDraft: evt.target.value}, () => {
			this.props.onValidateMessage(this.state.messageDraft);
		});
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
		const {messages, classes, messageValid} = this.props;
		const {messageDraft} = this.state;

		return (
			<div className={classes.chatApp}>
				<div className={classes.chatArea}>
					<div className={classes.header}>
						<FormattedMessage id="room.turnUser" values={{turnUser: this.props.turnUser.nickname, turnTime: this.props.turnTime}}/>
					</div>
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
								<div className={`${classes.messageFieldDiv} ${messageValid ? classes.valid : ''}`}>
									<input className={classes.messageField} type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
									<span className={classes.messageFieldWarning}>Invalid message</span>
								</div>
								<div className={classes.sendDiv}>
									<button
										type="button"
										className={classes.sendButton}
										onClick={this.handleSendMessage}
										disabled={!messageValid}
									>
										<FormattedMessage id="room.send"/>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className={classes.controlArea}>
					<div className={classes.header}>
						<button className={classes.themeButton}>theme</button>
					</div>
					<div className={classes.cardDivActive}>
						<div className={classes.caption}>
							<FormattedMessage id="room.activeCards"/>
						</div>
						<div className={classes.cardList}>
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
					</div>
					<div className={classes.cardDivOwn}>
						<div className={classes.caption}>
							<FormattedMessage id="room.hand"/>
						</div>
						<div className={classes.cardList}>
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
			</div>
		);
	}
}

export default withStyles(styles)(ChatRoom);
