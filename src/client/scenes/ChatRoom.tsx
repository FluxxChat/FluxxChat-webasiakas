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
import {OwnCard} from '../components/Card';
import MessageContainer from '../components/MessageContainer';
import {createStyles, Theme, WithStyles, withStyles, InputBase, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, FormControl, InputLabel, Select, TextField, Tooltip, CircularProgress} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import RulesIcon from '@material-ui/icons/Ballot';
import CardsIcon from '@material-ui/icons/ViewCarousel';
import ProfileIcon from '../components/ProfileIcon';

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
		minWidth: 0,
		display: 'flex',
		flexDirection: 'column'
	},
	controlArea: {
		flex: '0 0 auto',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fafafa',
		borderLeft: '1px solid #00000011',
		'& > $header': {
			justifyContent: 'flex-end',
			padding: '0 2rem'
		}
	},
	controls: {
		flex: '0 0 10rem',
		width: '10rem',
		display: 'flex',
		flexDirection: 'column',
		padding: '2rem 0',
		alignItems: 'center',
		'& > button': {
			width: '4.8rem'
		}
	},
	controlContentWrapper: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row'
	},
	themeButton: {
		border: 'none',
		background: 'transparent',
		fontWeight: 600,
		color: '#444',
		textTransform: 'uppercase'
	},
	cardArea: {
		flex: '0 0 auto',
		display: 'flex',
		padding: '0 1rem',
		maxHeight: 0,
		minWidth: 0,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		backgroundColor: '#f4f4f4',
		overflowY: 'hidden',
		overflowX: 'hidden',
		transition: 'all 0.2s',
		'&$visible': {
			maxHeight: '20rem',
			padding: '1rem',
			overflowX: 'auto',
			borderTop: '1px solid #00000011'
		}
	},
	ruleList: {
		flex: '1 0 30rem',
		display: 'flex',
		flexDirection: 'column',
		overflowX: 'hidden',
		transition: 'max-width 0.2s',
		maxWidth: 0,
		'&$visible': {
			maxWidth: '25vw',
			overflowY: 'auto',
			borderRight: '1px solid #00000011'
		}
	},
	ruleListItem: {
		width: '30vw',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem 4rem 1rem 2rem',
		borderBottom: '1px solid #00000011'
	},
	ruleTitle: {
		flex: '0 0 auto',
		fontSize: '1.2rem',
		fontWeight: 500
	},
	ruleDescription: {
		flex: '0 0 auto',
		marginTop: '0.2rem',
		fontSize: '1.1rem'
	},
	messageBox: {
		overflowX: 'hidden',
		overflowY: 'auto',
		flex: 1,
		borderRadius: theme.fluxx.borderRadius,
		padding: '1rem',
		fontSize: '1.2rem'
	},
	inputArea: {
		borderTop: '1px solid #00000011',
		padding: '0.6rem 1rem',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#f4f4f4'
	},
	valid: {},
	messageField: {
		flex: 1,
		padding: '0 1rem',
		fontSize: '1.6rem',
		boxSizing: 'border-box'
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
		fontWeight: 400,
		textAlign: 'center',
		margin: '2rem 0.4rem'
	},
	userListArea: {
		flex: 0.8,
		maxWidth: '80rem',
		display: 'flex',
		flexDirection: 'column',
		background: 'linear-gradient(160deg, #2a4058 0%, #171f28 100%)',
		'& > $header': {
			backgroundColor: '#00000011'
		}
	},
	userListContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: '1rem 0'
	},
	userList: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '24rem',
		flex: 1
	},
	userListItem: {
		display: 'flex',
		flexDirection: 'row',
		padding: '0 2rem',
		flex: '0 0 6rem',
		fontSize: '1.2rem',
		fontWeight: 500,
		color: '#ffffffdd',
		'&$highlight': {
			background: 'linear-gradient(90deg, #ffffff00 0%, #ffffff0a 100%)'
		}
	},
	profileIcon: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		'& > svg': {
			fontSize: '4rem'
		}
	},
	turnProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%) rotate(-90deg) !important'
	},
	userNickname: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
		paddingLeft: '1.6rem'
	},
	highlight: {},
	divider: {},
	iconButton: {},
	visible: {},
	ruleParameters: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: '2rem'
	}
});

interface Props extends WithStyles<typeof styles> {
	user: User;
	roomId: string;
	users: User[];
	turnUser: User;
	turnTime: number;
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
	showCards: boolean;
	showCard: boolean;
	showRules: boolean;
	selectedCard: Card | null;
	ruleParameters: RuleParameters;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: '',
		showCards: window.innerWidth >= 1280,
		selectedCard: null,
		showCard: false,
		showRules: window.innerWidth >= 1920,
		ruleParameters: {}
	};

	public scrollToBottom() {
		animateScroll.scrollToBottom({
			containerId: 'message-box',
			duration: 100
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

	public componentDidUpdate(_prevProps: Props, prevState: State) {
		const el = document.getElementById('message-box');
		if (el && el.scrollTop === (el.scrollHeight - el.offsetHeight)) {
			this.scrollToBottom();
		}

		if (this.state.selectedCard && !prevState.showCard && this.state.showCard) {
			const defaultRuleParameters = {};

			for (const key of Object.keys(this.state.selectedCard.parameterTypes)) {
				const type = this.state.selectedCard!.parameterTypes[key];

				if (Array.isArray(type)) {
					defaultRuleParameters[key] = type[0];
				}

				if (type === 'player') {
					defaultRuleParameters[key] = this.props.users[0]!.id;
				}

				if (type === 'number') {
					defaultRuleParameters[key] = 0;
				}
			}

			this.setState(state => ({
				ruleParameters: {
					...state.ruleParameters,
					...defaultRuleParameters
				}
			}));
		}
	}

	public toggleShowCards = () => {
		this.setState(state => ({showCards: !state.showCards}));
	}

	public handleClickCard = (card: Card) => {
		this.setState({showCard: true, selectedCard: card});
	};

	public handleCloseCardDialog = () => {
		this.setState({showCard: false, ruleParameters: {}});
	}

	public handlePlayCard = () => {
		this.props.onSendNewRule(this.state.selectedCard!, this.state.ruleParameters);
		this.handleCloseCardDialog();
	}

	public getParameterChangeHandler = (key: string) => (evt: React.ChangeEvent<any>) => {
		const value = evt.target.value;
		this.setState(state => ({
			ruleParameters: {
				...state.ruleParameters,
				[key]: value
			}
		}));
	};

	public handleToggleShowRules = () => {
		this.setState(state => ({showRules: !state.showRules}));
	}

	public render() {
		const {messages, classes, messageValid, users, user, activeCards, turnTime, turnUser} = this.props;
		const {messageDraft, selectedCard, showCards, showCard, ruleParameters, showRules} = this.state;

		return (
			<div className={classes.chatApp}>
				<div className={classes.userListArea}>
					<div className={classes.header}/>
					<div className={classes.userListContainer}>
						<div className={classes.userList}>
							{users.map(u => (
								<div
									key={u.id}
									className={`${classes.userListItem}
									${u.id === user.id ? classes.highlight : ''}`}
								>
									<div className={classes.profileIcon}>
										<ProfileIcon/>
										{u.id === turnUser.id && (
											<CircularProgress
												className={classes.turnProgress}
												variant="static"
												value={Math.floor((turnTime / 120) * 100)}
												size={52}
											/>
										)}
									</div>
									<div className={classes.userNickname}>{u.nickname}</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className={classes.chatArea}>
					<div className={classes.header}/>
					<div className={classes.messageBox} id="message-box">
						{messages.map((msg, index) => {
							return (
								<MessageContainer
									key={index}
									clientName={this.props.user.nickname}
									message={msg}
								/>
							);
						})}
					</div>
					<div className={`${classes.cardArea} ${showCards ? classes.visible : ''}`}>
						{this.props.ownCards.map((card, index) => {
							return (
								<OwnCard
									key={index}
									cardId={index.toString()}
									card={card}
									users={this.props.users}
									action={this.props.onSendNewRule}
									onClick={this.handleClickCard}
								/>
							);
						})}
						<div style={{flex: '0 0 1rem'}}/>
					</div>
					<div className={classes.inputArea}>
						<IconButton className={classes.iconButton} onClick={this.toggleShowCards}>
							<CardsIcon/>
						</IconButton>
						<InputBase
							className={classes.messageField}
							placeholder="Type your message..."
							onKeyDown={this.handleKeyDown}
							value={messageDraft}
							onChange={this.handleChangeMessageDraft}
						/>
						<Divider className={classes.divider} />
						<IconButton
							color="primary"
							className={classes.iconButton}
							onClick={this.handleSendMessage}
							disabled={!messageValid}
						>
							<SendIcon/>
						</IconButton>
					</div>
				</div>
				<div className={classes.controlArea}>
					<div className={classes.header}>
						<button className={classes.themeButton}>theme</button>
					</div>
					<div className={classes.controlContentWrapper}>
						<div className={`${classes.ruleList} ${showRules ? classes.visible : ''}`}>
							{activeCards.length === 0 && (
								<div className={classes.ruleListItem}>
									<div className={classes.ruleTitle}>Ei sääntöjä voimassa</div>
								</div>
							)}
							{activeCards.map((rule, index) => {
								const params = Object.keys(rule.parameters).map(key => {
									const val = rule.parameters[key];
									if (rule.parameterTypes[key] === 'player') {
										const player = users.find(u => u.id === val);
										return player ? player.nickname : '?';
									}
									return val;
								});
								const paramsStr = params.length > 0 ? ` (${params.join(', ')})` : '';
								return (
									<div className={classes.ruleListItem} key={index}>
										<div className={classes.ruleTitle}>{rule.name}{paramsStr}</div>
										<div className={classes.ruleDescription}>{rule.description}</div>
									</div>
								);
							})}
						</div>
						<div className={classes.controls}>
							<Tooltip title="Show active rules" placement="left" disableFocusListener>
								<IconButton onClick={this.handleToggleShowRules}>
									<RulesIcon/>
								</IconButton>
							</Tooltip>
						</div>
					</div>
				</div>
				<Dialog open={showCard} onClose={this.handleCloseCardDialog}>
					<DialogTitle>
						{selectedCard ? selectedCard.name : ''}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{selectedCard && selectedCard.description}
						</DialogContentText>
						<div className={classes.ruleParameters}>
							{selectedCard && Object.keys(selectedCard.parameterTypes).map(key => {
								const type = selectedCard.parameterTypes[key];

								if (Array.isArray(type)) {
									const choices = type as string[];
									return (
										<FormControl key={key}>
											<InputLabel><FormattedMessage id="card.selectValue"/></InputLabel>
											<Select
												native
												value={ruleParameters[key]}
												onChange={this.getParameterChangeHandler(key)}
											>
												{choices.map(c => (
													<option key={c} value={c}>{c}</option>
												))}
											</Select>
										</FormControl>
									);
								}
								switch (type) {
									case 'player':
										return (
											<FormControl key={key}>
												<InputLabel><FormattedMessage id="card.selectValue"/></InputLabel>
												<Select
													native
													value={ruleParameters[key]}
													onChange={this.getParameterChangeHandler(key)}
												>
													{users.map(u => (
														<option value={u.id}>{u.nickname}</option>
													))}
												</Select>
											</FormControl>
										);
									case 'number':
										return (
											<TextField
												key={key}
												label={<FormattedMessage id="card.giveNumber"/>}
												value={ruleParameters[key] || 0}
												onChange={this.getParameterChangeHandler(key)}
												margin="normal"
												type="number"
											/>
										);
									default:
										return null;
								}
							})}
						</div>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCloseCardDialog} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handlePlayCard} color="primary" autoFocus>
							Play
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(ChatRoom);
