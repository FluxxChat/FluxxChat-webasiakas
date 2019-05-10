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
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Theme, createStyles, withStyles, WithStyles, InputBase, Button, InputAdornment, TextField, ExpansionPanelSummary, ExpansionPanel, ExpansionPanelDetails } from '@material-ui/core';
import localeData from '../../../i18n/data.json';
import Header from './Header';
import themes from '../themes';
import { RoomParameters, Card, User, RuleParameters } from 'fluxxchat-protokolla';
import CardPicker from './CardPicker';
import RuleList from './RuleList';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		color: theme.fluxx.text.primary
	},
	menuContent: {
		padding: '5rem',
		display: 'flex',
		flexDirection: 'column',
		width: '80vw',
		maxWidth: '50rem',
		alignSelf: 'center',
		maxHeight: '80vh'
	},
	input: {
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.menu.input.background,
		padding: '1rem 2rem',
		borderRadius: '0.8rem',
		boxShadow: theme.fluxx.menu.input.shadow,
		flex: 1,
		fontSize: '1.6rem',
		boxSizing: 'border-box',
		color: 'inherit',
		transition: 'box-shadow 0.2s',
		'& button': {
			color: theme.fluxx.menu.button.color,
			whiteSpace: 'nowrap'
		},
		'&$focused': {
			boxShadow: theme.fluxx.menu.input.focus.shadow
		}
	},
	roomOptionsPanel: {
		borderRadius: '0.8rem',
		marginTop: '1rem',
		overflow: 'auto'
	},
	roomOptionsMenu: {
		background: theme.fluxx.menu.input.background,
		color: theme.fluxx.text.primary
	},
	roomOptionsMenuItem: {
		color: theme.fluxx.text.primary,
		'&$focused': {
			color: theme.fluxx.text.primary
		}
	},
	cardField: {
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column'
	},
	focused: {},
	startingCards: {
		overflow: 'hidden'
	}
});

interface OwnProps {
	type: 'join' | 'create';
	availableCards?: Card[];
	defaults: RoomParameters;
	onJoinRoom: (nickname: string) => any;
	onCreateRoom: (nickname: string, params: RoomParameters) => any;
	onChangeTheme: (theme: keyof typeof themes) => void;
	onChangeLocale: (locale: keyof typeof localeData) => void;
	onChangeAvatar: (image: string) => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

interface State {
	nickname: string;
	roomParameters: RoomParameters;
}

class Menu extends React.Component<Props, State> {

	constructor(props: any) {
		super(props);
		const deck: { [ruleName: string]: number } = {};
		if (this.props.availableCards) {
			for (const card of this.props.availableCards) {
				deck[card.ruleName] = 1;
			}
		}
		this.state = {
			nickname: '',
			roomParameters: { deck, startingRules: [] } as RoomParameters
		};
	}

	public handleAddStartingRule = (card: Card, ruleParameters: RuleParameters) => {
		const startingCard = card;
		startingCard.parameters = ruleParameters;
		const newRoomParams = this.state.roomParameters;
		newRoomParams.startingRules!.push(startingCard);
		this.setState({roomParameters: newRoomParams});
	}

	public handleClickSubmit = () => {
		if (this.props.type === 'join') {
			this.props.onJoinRoom(this.state.nickname);
		} else {
			this.props.onCreateRoom(this.state.nickname, this.state.roomParameters);
		}
	}

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this.handleClickSubmit();
		}
	}

	public handleChangeNickname = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ nickname: evt.target.value });
	}

	public HandleChangeNumericParam = (param: string) => (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams[param] = event.target.value;
		this.setState({roomParameters: newParams});
	}

	public handleDeckChange = ruleName => (event: React.ChangeEvent<any>) => {
		const newParams = this.state.roomParameters;
		newParams.deck![ruleName] = event.target.value;
		this.setState({ roomParameters: newParams });
	}

	public render() {
		const { type, onChangeTheme, intl, classes, onChangeLocale, onChangeAvatar } = this.props;

		const cardFields: JSX.Element[] = [];
		if (this.props.availableCards) {
			for (const card of this.props.availableCards) {
				cardFields.push(
					<TextField
						key={card.ruleName}
						className={this.props.classes.cardField}
						label={<FormattedMessage id={card.name} />}
						value={this.state.roomParameters.deck![card.ruleName] || 1}
						onChange={this.handleDeckChange(card.ruleName)}
						margin="normal"
						type="number"
						fullWidth
						InputLabelProps={{
							className: classes.roomOptionsMenuItem,
							classes: {
								focused: classes.focused
							}
						}}
						InputProps={{inputProps: {className: classes.roomOptionsMenuItem}}}
					/>
				);
			}
		}

		if (Object.keys(this.state.roomParameters.deck!).length === 0 && this.props.availableCards) {
			const newDeck: { [ruleName: string]: number } = {};
			for (const card of this.props.availableCards) {
				newDeck[card.ruleName] = 1;
			}
			const newParams = this.state.roomParameters;
			newParams.deck = newDeck;
			this.setState({roomParameters: newParams});
		}

		return (
			<div className={classes.root}>
				<Header onChangeTheme={onChangeTheme} onChangeLocale={onChangeLocale} onChangeAvatar={onChangeAvatar} />
				<div className={classes.menuContent}>
					<InputBase
						className={classes.input}
						placeholder={intl.formatMessage({ id: 'input.typeNickname' })}
						onKeyDown={this.handleKeyDown}
						value={this.state.nickname}
						onChange={this.handleChangeNickname}
						inputProps={{ maxLength: 30 }}
						autoFocus
						classes={{ focused: classes.focused }}
						endAdornment={
							<InputAdornment position="end">
								<Button size="small" onClick={this.handleClickSubmit} name="submit">
									{type === 'join'
										? <FormattedMessage id="login.joinRoom" />
										: <FormattedMessage id="login.createRoom" />}
								</Button>
							</InputAdornment>
						}
					/>
					{(this.props.type !== 'join') && (<div className={classes.roomOptionsPanel}>
						<ExpansionPanel className={classes.roomOptionsMenu}>
							<ExpansionPanelSummary>
								<FormattedMessage id="login.roomOptions" />
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div>
									<TextField
										label={<FormattedMessage id="login.turnLength" />}
										value={this.state.roomParameters.turnLength || this.props.defaults.turnLength}
										onChange={this.HandleChangeNumericParam('turnLength')}
										margin="normal"
										type="number"
										fullWidth
										InputLabelProps={{
											className: classes.roomOptionsMenuItem,
											classes: {
												focused: classes.focused
											}
										}}
										InputProps={{inputProps: {className: classes.roomOptionsMenuItem}}}
									/>
									<TextField
										label={<FormattedMessage id="login.nStartingHand" />}
										value={this.state.roomParameters.nStartingHand || this.props.defaults.nStartingHand}
										onChange={this.HandleChangeNumericParam('nStartingHand')}
										margin="normal"
										type="number"
										fullWidth
										InputLabelProps={{
											className: classes.roomOptionsMenuItem,
											classes: {
												focused: classes.focused
											}
										}}
										InputProps={{inputProps: {className: classes.roomOptionsMenuItem}}}
									/>
									<TextField
										label={<FormattedMessage id="login.nDraw" />}
										value={this.state.roomParameters.nDraw || this.props.defaults.nDraw}
										onChange={this.HandleChangeNumericParam('nDraw')}
										margin="normal"
										type="number"
										fullWidth
										InputLabelProps={{
											className: classes.roomOptionsMenuItem,
											classes: {
												focused: classes.focused
											}
										}}
										InputProps={{inputProps: {className: classes.roomOptionsMenuItem}}}
									/>
									<TextField
										label={<FormattedMessage id="login.nPlay" />}
										value={this.state.roomParameters.nPlay || this.props.defaults.nPlay}
										onChange={this.HandleChangeNumericParam('nPlay')}
										margin="normal"
										type="number"
										fullWidth
										InputLabelProps={{
											className: classes.roomOptionsMenuItem,
											classes: {
												focused: classes.focused
											}
										}}
										InputProps={{inputProps: {className: classes.roomOptionsMenuItem}}}
									/>
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.roomOptionsMenu}>
							<ExpansionPanelSummary>
								<FormattedMessage id="login.startingRules" />
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div className={classes.startingCards}>
									<RuleList
										rules={this.state.roomParameters.startingRules!}
										users={[] as User[]}
										messageBlockingRules={[] as string[]}
										messageBlockAnimation={false}
										ruleChangeRevalidation={this.nullFunction}
									/>
									<CardPicker
										onSendNewRule={this.handleAddStartingRule}
										cards={this.props.availableCards || [] as Card[]}
										users={[] as User[]}
										disabled={false}
									/>
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel>
							<ExpansionPanelSummary>
								<FormattedMessage id="login.deckEditor" />
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div>
									{cardFields}
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</div>
					)}
				</div>
			</div>
		);
	}

// this only exists because tslint wouldn't allow lambdas in JSX attributes
	private nullFunction = () => undefined;
}

export default withStyles(styles)(injectIntl(Menu));
