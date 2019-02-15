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
import {Card, User, RuleParameters} from 'fluxxchat-protokolla';
import {FormattedMessage} from 'react-intl';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import {NumberParameter, ChoiceParameter} from './CardParameters';

const styles = (theme: Theme) => createStyles({
	cardContainer: {
		overflowWrap: 'normal',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		flex: '0 0 calc(33% - 0.8rem)',
		margin: '0.5rem',
		borderRadius: theme.fluxx.borderRadius,
		backgroundColor: theme.fluxx.palette.foreground,
		boxShadow: '0.1rem 0.1rem 0.4rem 0 #00000022',
		boxSizing: 'border-box',
		overflow: 'hidden',
		fontSize: '1.2rem'
	},
	cardName: {
		width: '100%',
		fontSize: '1.4rem',
		fontWeight: 500,
		padding: '1rem 1rem 0.4rem 1rem',
		marginBottom: '0.6rem',
		boxSizing: 'border-box'
	},
	cardDescription: {
		width: '100%',
		flex: 1,
		padding: '0.4rem 1rem',
		marginBottom: '0.6rem',
		boxSizing: 'border-box'
	},
	addParameterDiv: {
		width: '100%',
		padding: '0.4rem 1rem',
		marginBottom: '0.6rem',
		boxSizing: 'border-box'
	},
	selectRuleTarget: {
		width: '40%'
	},
	setParameterNumber: {
		width: '40%'
	},
	playButton: {
		padding: '0.6rem 1rem',
		border: 'none',
		borderTop: '1px solid #00000011',
		backgroundColor: 'transparent',
		fontWeight: 500,
		color: '#000000aa',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: '#00000008'
		},
		'&:active, &:focus': {
			outline: 'none'
		}
	},
	playButtonContainer: {
		display: 'flex',
		flexDirection: 'column'
	}
});

interface ActiveCardProps extends WithStyles<typeof styles> {
	card: Card;
	users: User[];
}

interface OwnCardProps extends WithStyles<typeof styles> {
	cardId: string;
	card: Card;
	users: User[];
	action: (card: Card, ruleParameters: RuleParameters) => void;
}

interface OwnCardState {
	ruleParameters: RuleParameters;
}

const ActiveCard = ({card, users, classes}: ActiveCardProps) => {
	let parameter = '';
	let parameterAmount = 0;

	Object.keys(card.parameterTypes).forEach(key => {
		switch (card.parameterTypes[key]) {
			case 'player':
				if (parameterAmount === 0) {
					parameter += '(';
				} else if (parameterAmount > 0) {
					parameter += ', ';
				}
				parameterAmount++;
				let playerName = '';
				users.forEach(user => {
					if (card.parameters[key] === user.id) {
						playerName = user.nickname;
					}
				});
				parameter += playerName;
				break;
			case 'number':
				if (parameterAmount === 0) {
					parameter += '(';
				} else if (parameterAmount > 0) {
					parameter += ', ';
				}
				parameterAmount++;
				parameter += card.parameters[key];
				break;
			default:
				if (parameterAmount === 0) {
					parameter += '(';
				} else if (parameterAmount > 0) {
					parameter += ', ';
				}
				parameterAmount++;
				parameter += card.parameters[key];
				break;
		}
	});

	if (parameterAmount > 0) {
		parameter += ')';
	}

	return (
		<div className={classes.cardContainer}>
			<div className={classes.cardName}>
				{card.name} {parameter}
			</div>
			<div className={classes.cardDescription}>
				{card.description}
			</div>
		</div>
	);
};

const StyledActiveCard = withStyles(styles)(ActiveCard);
export {StyledActiveCard as ActiveCard};

class OwnCard extends React.Component<OwnCardProps, OwnCardState> {
	public state: OwnCardState = {ruleParameters: {}};

	public handleClick = () => {
		this.props.action(this.props.card, this.state.ruleParameters);
	}

	public getParameterChangeHandler = (parameter: string) => (evt: React.ChangeEvent<any>) => {
		const value = evt.target.value;
		this.setState(state => ({
			ruleParameters: {
				...state.ruleParameters,
				[parameter]: value
			}
		}));
	}

	public render() {
		const {classes} = this.props;

		return (
			<div className={classes.cardContainer}>
				<div className={classes.cardName}>
					{this.props.card.name}
				</div>
				<div className={classes.cardDescription}>
					{this.props.card.description}
				</div>
				<div className={classes.playButtonContainer}>
					{Object.keys(this.props.card.parameterTypes).map(key => {
						if (Array.isArray(this.props.card.parameterTypes[key])) {
							const choices = this.props.card.parameterTypes[key] as string[];
							return (
								<div key={key} className={classes.addParameterDiv}>
									<FormattedMessage id="card.selectValue"/>:
									<ChoiceParameter
										choices={choices.map(c => ({display: c, id: c}))}
										onChange={this.getParameterChangeHandler(key)}
										value={this.state.ruleParameters[key]}
									/>
								</div>
							);
						}
						switch (this.props.card.parameterTypes[key]) {
							case 'player':
								return (
									<div key={key} className={classes.addParameterDiv}>
										<FormattedMessage id="card.selectTarget"/>:
										<ChoiceParameter
											choices={this.props.users.map(u => ({display: u.nickname, id: u.id}))}
											onChange={this.getParameterChangeHandler(key)}
											value={this.state.ruleParameters[key]}
										/>
									</div>
								);
							case 'number':
								return (
									<div key={key} className={classes.addParameterDiv}>
										<FormattedMessage id="card.giveNumber"/>:
										<NumberParameter
											onChange={this.getParameterChangeHandler(key)}
											value={this.state.ruleParameters[key]}
										/>
									</div>
								);
							default:
								return null;
						}
					})}
					<button type="button" className={classes.playButton} onClick={this.handleClick}>
						<FormattedMessage id="card.play"/>
					</button>
				</div>
			</div>
		);
	}
}

const StyledOwnCard = withStyles(styles)(OwnCard);
export {StyledOwnCard as OwnCard};
