import React from 'react';
import {Card, User, RuleParameters} from 'fluxxchat-protokolla';
import {FormattedMessage} from 'react-intl';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import {NumberParameter, PlayerParameter} from './CardParameters';

const styles = (theme: Theme) => createStyles({
	cardContainer: {
		width: 'calc(33% - 20px)',
		height: 'calc(50% - 20px)',
		overflowWrap: 'normal',
		margin: '5px 1px 2px 5px',
		float: 'left',
		position: 'relative',
		border: `1px solid ${theme.fluxx.palette.border}`
	},
	cardName: {
		width: '100%',
		height: '30px',
		padding: '16px 0 0 10px',
		fontSize: '20px',
		fontWeight: 'bold'
	},
	cardDescription: {
		width: '100%',
		height: 'calc(100% - 30px)',
		paddingTop: '16px',
		paddingLeft: '10px',
		fontSize: '14px'
	},
	addParameterDiv: {
		width: '100%',
		marginBottom: '26px',
		position: 'absolute',
		bottom: '2px'
	},
	selectRuleTarget: {
		width: '40%',
		float: 'right',
		marginRight: '2px'
	},
	setParameterNumber: {
		width: '40%',
		float: 'right',
		marginRight: '2px'
	},
	playButton: {
		width: 'calc(100% - 4px)',
		marginTop: '5px',
		height: '23px',
		bottom: '3px',
		marginLeft: '2px'
	},
	playButtonContainer: {
		width: 'calc(100% - 4px)',
		marginTop: '5px',
		position: 'absolute',
		bottom: '2px',
		left: '2px'
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
				parameter += '';
				break;
		}
	});

	if (parameterAmount > 0) {
		parameter += ')';
	}

	return (
		<div className={classes.cardContainer}>
			<div>
				<div className={classes.cardName}>
					{card.name} {parameter}
				</div>
				<div className={classes.cardDescription}>
					{card.description}
				</div>
			</div>
		</div>
	);
};

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
				<div>
					<div className={classes.cardName}>
						{this.props.card.name}
					</div>
					<div className={classes.cardDescription}>
						{this.props.card.description}
					</div>
				</div>
				<div className={classes.playButtonContainer}>
					{Object.keys(this.props.card.parameterTypes).map(key => {
						switch (this.props.card.parameterTypes[key]) {
							case 'player':
								return (
									<div key={key} className={classes.addParameterDiv}>
										<FormattedMessage id="card.selectTarget"/>:
										<PlayerParameter
											users={this.props.users}
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
