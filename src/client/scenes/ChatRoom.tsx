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
import {Card, RuleParameters, User, SystemMessage, TextMessage} from 'fluxxchat-protokolla';
import CardComponent from '../components/CardComponent';
import MessageList from '../components/MessageList';
import {
	createStyles,
	WithStyles,
	withStyles,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Tooltip,
	Menu,
	MenuItem,
	Theme
} from '@material-ui/core';
import RulesIcon from '@material-ui/icons/Ballot';
import ThemeIcon from '@material-ui/icons/ColorLens';
import UserList from '../components/UserList';
import UserInput from '../components/UserInput';
import RuleList from '../components/RuleList';
import CardParameterInput from '../components/CardParameterInput';
import themes from '../themes';
import {FormattedMessage} from 'react-intl';

const styles = (theme: Theme) => createStyles({
	sendDiv: {},
	header: {
		fontSize: '1.4rem',
		fontWeight: 500,
		flex: '0 0 5rem',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		background: theme.fluxx.chat.header.background,
		borderBottom: `1px solid ${theme.fluxx.border.darker}`
	},
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
		flexDirection: 'column',
		'& > $header': {
			justifyContent: 'flex-end',
			borderLeft: `1px solid ${theme.fluxx.border.darker}`,
			padding: '0 1rem',
			'& button': {
				width: '4rem',
				height: '4rem',
				padding: '0.4rem',
				color: theme.fluxx.icon.primary
			}
		}
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
	controlArea: {
		flex: '0 0 auto',
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.controlArea.background,
		justifyContent: 'flex-end',
		zIndex: 50
	},
	controls: {
		width: '6rem',
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem 0',
		alignItems: 'center',
		borderLeft: `1px solid ${theme.fluxx.border.darker}`,
		'& > button': {
			width: '4.8rem',
			color: theme.fluxx.icon.primary
		}
	},
	cardArea: {
		flex: '0 0 auto',
		display: 'flex',
		padding: '0 1rem',
		maxHeight: 0,
		minWidth: 0,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		background: theme.fluxx.cards.background,
		overflowY: 'hidden',
		overflowX: 'hidden',
		transition: 'all 0.2s',
		'&$visible': {
			maxHeight: '20rem',
			padding: '1rem',
			overflowX: 'auto',
			borderTop: `1px solid ${theme.fluxx.border.darker}`
		}
	},
	userListArea: {
		flex: 0.6,
		maxWidth: '60rem',
		display: 'flex',
		flexDirection: 'column',
		background: theme.fluxx.users.background,
		boxShadow: '0 0 1rem 0.2rem #00000054',
		zIndex: 50,
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
	messages: Array<TextMessage | SystemMessage>;
	ownCards: Card[];
	activeCards: Card[];
	messageValid: boolean;
	onSendMessage: (message: string) => void;
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
	onValidateMessage: (message: string) => void;
	onChangeTheme: (theme: string) => void;
}

interface State {
	messageDraft: string;
	showCards: boolean;
	showCard: boolean;
	showRules: boolean;
	selectedCard: Card | null;
	ruleParameters: RuleParameters;
	anchorEl: any;
	showThemeMenu: boolean;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: '',
		showCards: window.innerWidth >= 1280,
		selectedCard: null,
		showCard: false,
		showRules: window.innerWidth >= 1920,
		ruleParameters: {},
		anchorEl: null,
		showThemeMenu: false
	};

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		if (messageDraft && this.props.messageValid) {
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

	public componentDidUpdate(_prevProps: Props, prevState: State) {
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

	public handleClickThemeBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({showThemeMenu: true, anchorEl: evt.currentTarget});
	}

	public handleCloseThemeMenu = () => {
		this.setState({showThemeMenu: false, anchorEl: null});
	}

	public getThemeSelectHandler = (theme: keyof typeof themes) => () => {
		this.props.onChangeTheme(theme);
		this.handleCloseThemeMenu();
	}

	public render() {
		const {
			messages,
			classes,
			messageValid,
			users,
			user,
			activeCards,
			turnTime,
			turnUser
		} = this.props;
		const {
			messageDraft,
			selectedCard,
			showCards,
			showCard,
			ruleParameters,
			showRules,
			showThemeMenu,
			anchorEl
		} = this.state;

		return (
			<div className={classes.chatApp}>
				<div className={classes.userListArea}>
					<div className={classes.header}/>
					<div className={classes.userListContainer}>
						<UserList
							users={users}
							clientUser={user}
							turnUser={turnUser}
							turnTimePercent={Math.floor((turnTime / 120) * 100)}
						/>
					</div>
				</div>
				<div className={classes.chatArea}>
					<div className={classes.header}>
						<Tooltip title={<FormattedMessage id="tooltip.changeTheme"/>} placement="left" disableFocusListener>
							<IconButton onClick={this.handleClickThemeBtn}>
								<ThemeIcon/>
							</IconButton>
						</Tooltip>
					</div>
					<div className={classes.chatContainer}>
						<div className={classes.messageArea}>
							<MessageList clientUser={user} messages={messages}/>
							<div className={`${classes.cardArea} ${showCards ? classes.visible : ''}`}>
								{this.props.ownCards.map((card, index) => {
									return (
										<CardComponent
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
							<UserInput
								value={messageDraft}
								onChange={this.handleChangeMessageDraft}
								valid={messageValid}
								onToggleCards={this.toggleShowCards}
								onSend={this.handleSendMessage}
							/>
						</div>
						<div className={classes.controlArea}>
							<RuleList
								rules={activeCards}
								users={users}
								visible={showRules}
							/>
							<div className={classes.controls}>
								<Tooltip title={<FormattedMessage id="tooltip.toggleRules"/>} placement="left" disableFocusListener>
									<IconButton onClick={this.handleToggleShowRules}>
										<RulesIcon/>
									</IconButton>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
				<Menu
					anchorEl={anchorEl}
					open={showThemeMenu}
					onClose={this.handleCloseThemeMenu}
				>
					<MenuItem onClick={this.getThemeSelectHandler('light')}>
						<FormattedMessage id="theme.light"/>
						</MenuItem>
					<MenuItem onClick={this.getThemeSelectHandler('dark')}>
						<FormattedMessage id="theme.dark"/>
					</MenuItem>
				</Menu>
				<Dialog open={showCard} onClose={this.handleCloseCardDialog}>
					<DialogTitle>
						{selectedCard ? selectedCard.name : ''}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{selectedCard && selectedCard.description}
						</DialogContentText>
						<div className={classes.ruleParameters}>
							{selectedCard && Object.keys(selectedCard.parameterTypes).map(key => (
								<CardParameterInput
									key={key}
									type={selectedCard.parameterTypes[key]}
									value={ruleParameters[key]}
									users={users}
									onChange={this.getParameterChangeHandler(key)}
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
