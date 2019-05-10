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

import CardComponent from './CardComponent';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, WithStyles, withStyles, createStyles, Theme} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import {FormattedRuleDescription} from './FormattedRuleDescription';
import CardParameterInput from './CardParameterInput';
import React from 'react';
import ScrollArea from 'react-scrollbar';
import { Card, RuleParameters, User } from 'fluxxchat-protokolla';

const styles = (theme: Theme) => createStyles({
	root: {

	},
	visible: {},
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
	ruleParameters: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: '2rem'
	}
});

interface OwnProps {
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
	cards: Card[];
	users: User[];
	disabled: boolean;
}

type Props = OwnProps & WithStyles<typeof styles>;

interface State {
	showCard: boolean;
	selectedCard: Card | null;
	ruleParameters: RuleParameters;
}

class CardPicker extends React.Component<Props, State> {
	public state: State = {
		// showCards: true,
		showCard: false,
		selectedCard: null,
		ruleParameters: {}
	};

	public cardScrollRef = React.createRef<any>();

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

	// public toggleShowCards = () => {
	// 	this.setState(state => ({ showCards: !state.showCards }));
	// }

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

	public render() {
		const {
			classes,
			users
		} = this.props;

		const {
			selectedCard,
			// showCards,
			showCard,
			ruleParameters
		} = this.state;
		return (
			<div>
				<ScrollArea
					ref={this.cardScrollRef}
					// className={`${classes.cardArea} ${showCards ? classes.visible : ''}`}
					className={`${classes.cardArea} ${classes.visible}`}
					contentClassName={classes.cardAreaScrollContent}
					horizontalContainerStyle={{ height: '0.4rem' }}
					smoothScrolling
					swapWheelAxes
				>
					{this.props.cards.map((card, index) => {
						return (
							<CardComponent
								key={index}
								cardId={index.toString()}
								card={card}
								users={users}
								action={this.props.onSendNewRule}
								onClick={this.handleClickCard}
								disabled={this.props.disabled}
							/>
						);
					})}
					<div style={{ flex: '0 0 1rem' }} />
				</ScrollArea>
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
			</div >
		);
	}
}

export default withStyles(styles)(CardPicker);
