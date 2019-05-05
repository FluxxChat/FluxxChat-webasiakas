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
import { Card, RuleParameters, User, SystemMessage, TextMessage, UiVariables } from 'fluxxchat-protokolla';
import {
	createStyles,
	WithStyles,
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Theme
} from '@material-ui/core';
import ScrollArea from 'react-scrollbar';
import localeData from '../../../i18n/data.json';
import UserList from '../components/UserList';
import UserInput, { MessageDraftChangeEvent } from '../components/UserInput';
import RuleList from '../components/RuleList';
import CardParameterInput from '../components/CardParameterInput';
import Header from '../components/Header';
import CardComponent from '../components/CardComponent';
import MessageList from '../components/MessageList';
import { FormattedRuleDescription } from '../components/FormattedRuleDescription';
import { FormattedMessage } from 'react-intl';

const styles = (theme: Theme) => createStyles({
	sendDiv: {},
	header: {},
	chatApp: {
		width: '100%',
		height: '100%',
		display: 'flex',
		color: theme.fluxx.text.primary
	},
	chatArea: {
		flex: 1,
		minWidth: 0,
		display: 'flex',
		flexDirection: 'column'
	},
	chatContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden'
	},
	messageArea: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		minWidth: 0
	},
	ruleListArea: {
		flex: '0 0 auto',
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.controlArea.background,
		borderTop: `3px solid ${theme.fluxx.border.darker}`,
		justifyContent: 'flex-start'
	},
	turnInfo: {
		flex: '0 0 auto',
		padding: '1rem',
		borderTop: `1px solid ${theme.fluxx.border.darker}`,
		background: theme.fluxx.cards.background
	},
	tabularNumber: {
		minWidth: '3rem',
		display: 'inline-block',
		textAlign: 'right',
		fontVariantNumeric: 'tabular-nums'
	},
	cardArea: {
		flex: '0 0 auto',
		display: 'flex',
		maxHeight: 0,
		minWidth: 0,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		background: theme.fluxx.cards.background,
		overflowY: 'hidden',
		transition: 'all 0.2s',
		'&$visible': {
			maxHeight: '20rem',
			borderTop: `1px solid ${theme.fluxx.border.darker}`
		}
	},
	cardAreaScrollContent: {
		display: 'flex',
		padding: '1rem',
		flex: '0 0 auto',
		width: 'min-content'
	},
	userListArea: {
		flex: 0.6,
		maxWidth: '65rem',
		display: 'flex',
		flexDirection: 'column',
		background: theme.fluxx.users.background,
		zIndex: 50,
		'& > $header': {
			backgroundColor: '#00000044',
			flex: '0 0 5rem',
			borderBottom: `1px solid ${theme.fluxx.border.darker}`,
			borderRight: `1px solid ${theme.fluxx.border.darker}`
		}
	},
	userListContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: '1rem 0',
		borderRight: `1px solid ${theme.fluxx.border.darker}`
	},
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
	turnTimeLeft: number; // in seconds
	turnLength: number; // in seconds
	messages: Array<TextMessage | SystemMessage>;
	playableCardsLeft: number;
	ownCards: Card[];
	activeCards: Card[];
	messageValid: boolean;
	messageBlockingRules: string[];
	suggestedWord: string;
	uiVariables: UiVariables;
	onSendMessage: (textmessage: string, image: string, audio: any, response: { senderId: string, timestamp: string } | null) => void;
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
	onValidateMessage: (textmessage: string, image: string, audio: any) => void;
	onChangeTheme: (theme: string) => void;
	onChangeLocale: (locale: keyof typeof localeData) => void;
	onChangeAvatar: (image: string) => void;
}

interface State {
	messageDraft: { textContent: string, imageContent: string, audioContent: { url: string, length: number } };
	showCards: boolean;
	showCard: boolean;
	selectedCard: Card | null;
	ruleParameters: RuleParameters;
	messageBlockedAnimation: boolean;
	respondingTo: { senderId: string, senderNickname: string, timestamp: string } | null;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: { textContent: '', imageContent: '', audioContent: { url: '', length: 0 } },
		showCards: window.innerWidth >= 1280,
		selectedCard: null,
		showCard: false,
		ruleParameters: {},
		messageBlockedAnimation: false,
		respondingTo: null
	};

	public cardScrollRef = React.createRef<any>();

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		if (!!this.props.uiVariables.threads === false) {
			this.setState({respondingTo: null});
		}
		if ((messageDraft.textContent || messageDraft.imageContent || messageDraft.audioContent.url) && this.props.messageValid) {
			this.setState({
				messageDraft: {
					textContent: '',
					imageContent: '',
					audioContent: { url: '', length: 0 },
					respondingTo: null
				}
			}, () => {
				this.props.onSendMessage(
					messageDraft.textContent,
					messageDraft.imageContent,
					messageDraft.audioContent,
					this.state.respondingTo
				);
			});
		}
	}

	public handleChangeMessageDraft = (event: MessageDraftChangeEvent) => {
		if (event.type === 'TEXT') {
			this.setState({
				messageDraft: {
					textContent: event.newContent,
					imageContent: this.state.messageDraft.imageContent,
					audioContent: this.state.messageDraft.audioContent
				}
			}, () => {
				this.props.onValidateMessage(
					this.state.messageDraft.textContent,
					this.state.messageDraft.imageContent,
					this.state.messageDraft.audioContent
				);
			});
		} else if (event.type === 'IMAGE') {
			const f = event.event.target.files![0];
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.setState({
					messageDraft: {
						textContent: this.state.messageDraft.textContent,
						imageContent: e.target.result,
						audioContent: this.state.messageDraft.audioContent
					}
				});
			};
			reader.readAsDataURL(f);
		} else if (event.type === 'AUDIO') {
			this.setState({
				messageDraft: {
					textContent: this.state.messageDraft.textContent,
					imageContent: this.state.messageDraft.imageContent,
					audioContent: event.newContent
				}
			});
		}
	}

	public handleInsertEmoji = (emoji: string) => {
		const d = this.state.messageDraft;
		this.setState({ messageDraft: { ...d, textContent: d.textContent + emoji } }, () => {
			this.props.onValidateMessage(
				this.state.messageDraft.textContent,
				this.state.messageDraft.imageContent,
				this.state.messageDraft.audioContent
			);
		});
	}

	public componentDidUpdate(_prevProps: Props, prevState: State) {
		if (this.state.selectedCard && !prevState.showCard && this.state.showCard) {
			const defaultRuleParameters = {};

			for (const key of Object.keys(this.state.selectedCard.parameterTypes)) {
				if (this.state.selectedCard.parameters[key] !== undefined) {
					defaultRuleParameters[key] = this.state.selectedCard.parameters[key];
					continue;
				}

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
		this.setState(state => ({ showCards: !state.showCards }));
	}

	public handleClickCard = (card: Card) => {
		this.setState({ showCard: true, selectedCard: card });
	};

	public handleCloseCardDialog = () => {
		this.setState({ showCard: false, ruleParameters: {} });
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

	public messageBlockedAnimation = (value: boolean) => {
		this.setState({ messageBlockedAnimation: value });
	}

	public ruleChangeRevalidation = () => {
		this.props.onValidateMessage(
			this.state.messageDraft.textContent,
			this.state.messageDraft.imageContent,
			this.state.messageDraft.audioContent
		);
	}

	public onToggleThread = (senderId: string, senderNickname: string, timestamp: string) => {
		if (senderId === '' && senderNickname === '' && timestamp === '') {
			this.setState({ respondingTo: null });
		} else {
			this.setState({
				respondingTo: {
					senderId,
					senderNickname,
					timestamp
				}
			});
		}
	}

	public onCancelResponse = () => {
		this.setState({ respondingTo: null });
	}

	public render() {
		const {
			messages,
			classes,
			messageValid,
			users,
			user,
			activeCards,
			turnTimeLeft: turnTime,
			turnUser,
			uiVariables,
			suggestedWord,
			onChangeTheme,
			onChangeLocale,
			onChangeAvatar
		} = this.props;
		const {
			messageDraft,
			selectedCard,
			showCards,
			showCard,
			ruleParameters,
			messageBlockedAnimation,
			respondingTo
		} = this.state;

		return (
			<div className={classes.chatApp}>
				<div className={classes.userListArea}>
					<div className={classes.header} />
					<div className={classes.userListContainer}>
						<UserList
							users={users}
							clientUser={user}
							turnUser={turnUser}
							turnTimePercent={Math.floor((turnTime / this.props.turnLength) * 100)}
						/>
					</div>
					<div className={classes.ruleListArea}>
						<RuleList
							rules={activeCards}
							users={users}
							messageBlockingRules={this.props.messageBlockingRules}
							messageBlockAnimation={messageBlockedAnimation}
							ruleChangeRevalidation={this.ruleChangeRevalidation}
						/>
					</div>
				</div>
				<div className={classes.chatArea}>
					<Header onChangeTheme={onChangeTheme} onChangeLocale={onChangeLocale} onChangeAvatar={onChangeAvatar} />
					<div className={classes.chatContainer}>
						<div className={classes.messageArea}>
							<MessageList
								clientUser={user}
								messages={messages}
								variables={uiVariables}
								respondingTo={respondingTo}
								onToggleThread={this.onToggleThread}
							/>
							<div className={classes.turnInfo}> {
								this.props.turnUser.id === this.props.user.id ?
									<span>
										<FormattedMessage id="room.playableCardsLeft" values={{ n: this.props.playableCardsLeft }} />
										, <span className={classes.tabularNumber}>
											{this.props.turnTimeLeft}
										</span>
										<FormattedMessage id="room.secondsInYourTurn" />
									</span>
									:
									<span>
										<FormattedMessage id="room.notYourTurn" />
										, <span className={classes.tabularNumber}>{
											this.props.turnTimeLeft + (this.props.turnLength * (
												// all of this just calculates the number of turns between the active player and the current player
												(((this.props.users.indexOf(this.props.user) - this.props.users.indexOf(this.props.turnUser) - 1) % this.props.users.length) + this.props.users.length) % this.props.users.length
											))
										}</span>
										<FormattedMessage id="room.secondsTillYourTurn" />
									</span>
							}
							</div>
							<ScrollArea
								ref={this.cardScrollRef}
								className={`${classes.cardArea} ${showCards ? classes.visible : ''}`}
								contentClassName={classes.cardAreaScrollContent}
								horizontalContainerStyle={{ height: '0.4rem' }}
								smoothScrolling
								swapWheelAxes
							>
								{this.props.ownCards.map((card, index) => {
									return (
										<CardComponent
											key={index}
											cardId={index.toString()}
											card={card}
											users={this.props.users}
											action={this.props.onSendNewRule}
											onClick={this.handleClickCard}
											disabled={this.props.turnUser.id !== this.props.user.id || this.props.playableCardsLeft === 0}
										/>
									);
								})}
								<div style={{ flex: '0 0 1rem' }} />
							</ScrollArea>
							<UserInput
								value={messageDraft}
								onMessageDraftChange={this.handleChangeMessageDraft}
								onInsertEmoji={this.handleInsertEmoji}
								valid={messageValid}
								inputMinHeight={uiVariables.inputMinHeight || 1}
								imageMessages={!!uiVariables.imageMessages}
								audioMessages={!!uiVariables.audioMessages}
								threads={!!uiVariables.threads}
								respondingTo={respondingTo}
								emojiPicker={uiVariables.emojiPicker === undefined ? true : uiVariables.emojiPicker}
								disableBackspace={!!uiVariables.disableBackspace}
								wordSuggestions={!!uiVariables.wordSuggestions}
								suggestedWord={suggestedWord}
								onToggleCards={this.toggleShowCards}
								onSend={this.handleSendMessage}
								messageBlockedAnimation={this.messageBlockedAnimation}
								cancelResponse={this.onCancelResponse}
							/>
						</div>
					</div>
				</div>
				<Dialog open={showCard} onClose={this.handleCloseCardDialog}>
					<DialogTitle>
						{selectedCard ? <FormattedMessage id={selectedCard.name} /> : ''}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{selectedCard && <FormattedRuleDescription rule={selectedCard} />}
						</DialogContentText>
						<div className={classes.ruleParameters}>
							{selectedCard && Object.keys(selectedCard.parameterTypes).map(key => (
								<CardParameterInput
									key={key}
									type={selectedCard.parameterTypes[key]}
									value={ruleParameters[key]}
									users={users}
									onChange={this.getParameterChangeHandler(key)}
									enabled={selectedCard.parameters[key] === undefined}
								/>
							))}
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
