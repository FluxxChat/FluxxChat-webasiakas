import React from 'react';
import {Card, User, RuleParameters} from 'fluxxchat-protokolla';
import {FormattedMessage} from 'react-intl';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import {NumberParameter, ChoiceParameter} from './CardParameters';

const styles = (theme: Theme) => createStyles({
	cardContainer: {
		width: 'calc(33% - 20px)',
		overflowWrap: 'normal',
		margin: '5px 1px 2px 5px',
		padding: '5px',
		position: 'relative',
		border: `1px solid ${theme.fluxx.palette.border}`,
		display: 'flex',
		flexDirection: 'column'
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
		fontSize: '14px',
		flex: 1
	},
	addParameterDiv: {
		width: '100%',
		marginBottom: '5px',
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
		bottom: '2px',
		left: '2px',
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
							const choices: string[] = this.props.card.parameterTypes[key] as string[];
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
