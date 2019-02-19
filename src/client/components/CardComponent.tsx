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
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
// import {NumberParameter, ChoiceParameter} from './CardParameters';

const styles = (theme: Theme) => createStyles({
	cardContainer: {
		overflowWrap: 'normal',
		display: 'flex',
		flex: '0 0 13rem',
		minWidth: '13rem',
		height: '16rem',
		borderRadius: theme.fluxx.cards.card.borderRadius,
		background: theme.fluxx.cards.card.background,
		boxShadow: theme.fluxx.cards.card.shadow,
		boxSizing: 'border-box',
		overflow: 'hidden',
		fontWeight: 500,
		fontSize: '1rem',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		cursor: 'pointer',
		transition: 'box-shadow 0.1s',
		color: theme.fluxx.text.primary,
		'&:not(:first-child)': {
			marginLeft: '1rem'
		},
		'&:hover': {
			boxShadow: theme.fluxx.cards.card.hover.shadow
		}
	},
	cardName: {
		width: '100%',
		padding: '1rem 1.4rem 0.4rem 1.4rem',
		marginBottom: '0.6rem',
		boxSizing: 'border-box'
	}
});

interface Props extends WithStyles<typeof styles> {
	cardId: string;
	card: Card;
	users: User[];
	action: (card: Card, ruleParameters: RuleParameters) => void;
	onClick: (card: Card) => void;
}

class CardComponent extends React.Component<Props> {
	public handleClick = () => {
		this.props.onClick(this.props.card);
	}

	public render() {
		const {card, classes} = this.props;

		return (
			<div className={classes.cardContainer} onClick={this.handleClick}>
				<div className={classes.cardName}>
					{card.name}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(CardComponent);
