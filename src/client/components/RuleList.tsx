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
import {User, Card} from 'fluxxchat-protokolla';
import {withStyles, createStyles, WithStyles, Theme} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

const styles = (theme: Theme) => createStyles({
	root: {
		bottom: 0,
		flex: '1 0 30rem',
		display: 'flex',
		flexDirection: 'column',
		overflowX: 'hidden',
		boxSizing: 'border-box',
		minHeight: '15vW',
		overflowY: 'auto'
	},
	ruleListItem: {
		width: '100%',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'row',
		padding: '1rem 1rem 1rem 1rem',
		borderBottom: `1px solid ${theme.fluxx.border.darker}`,
		transition: 'all 300ms ease-out'
	},
	ruleListItemBlocking: {
		background: theme.fluxx.MessageBlocgingRule.background,
		width: '100%',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'row',
		padding: '1rem 1rem 1rem 1rem',
		borderBottom: `1px solid ${theme.fluxx.border.darker}`,
		transition: 'all 300ms ease-out'
	},
	ruleListItemBlockingError: {
		background: theme.fluxx.MessageBlocgingRule.errorBackground,
		width: '100%',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'row',
		padding: '1rem 1rem 1rem 1rem',
		borderBottom: `1px solid ${theme.fluxx.border.darker}`
	},
	ruleInfo: {
		boxSizing: 'border-box',
		display: 'flex',
		flex: 1,
		flexDirection: 'column'
	},
	ruleTitle: {
		flex: '0 0 auto',
		fontSize: '1.2rem',
		fontWeight: 500
	},
	ruleDescription: {
		flex: '0 0 auto',
		marginTop: '0.2rem',
		fontSize: '1.1rem',
		wordBreak: 'break-word'
	}
});

interface Props extends WithStyles<typeof styles> {
	rules: Card[];
	users: User[];
	messageBlockingRules: string[];
	messageBlockAnimation: boolean;
}

interface State {
	animation: boolean;
}

class RuleList extends React.Component<Props, State> {
	public state = {animation: false};

	public componentDidUpdate(prevProps) {
		if (this.props.messageBlockAnimation !== prevProps.messageBlockAnimation) {
			this.setState({animation: this.props.messageBlockAnimation});
		}
	}

	public render() {
		const {rules, users, messageBlockingRules, classes} = this.props;
		const {animation} = this.state;

		return (
			<div className={classes.root}>
				{rules.length === 0 && (
					<div className={classes.ruleListItem}>
						<div className={classes.ruleTitle}><FormattedMessage id="rules.noRules"/></div>
					</div>
				)}
				{rules.map((rule, index) => {
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
						<div
							key={index}
							className={messageBlockingRules.includes(rule.name) ? (
								animation ?
								classes.ruleListItemBlockingError :
								classes.ruleListItemBlocking
							) : classes.ruleListItem}

						>
							<div className={classes.ruleInfo}>
								<div className={classes.ruleTitle}>{rule.name}{paramsStr}</div>
								<div className={classes.ruleDescription}>{rule.description}</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default withStyles(styles)(RuleList);
