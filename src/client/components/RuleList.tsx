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
		flex: '1 0 30rem',
		display: 'flex',
		flexDirection: 'column',
		overflowX: 'hidden',
		transition: 'max-width 0.2s',
		boxSizing: 'border-box',
		maxWidth: 0,
		'&$visible': {
			maxWidth: '25vw',
			overflowY: 'auto',
			borderLeft: `1px solid ${theme.fluxx.border.darker}`
		}
	},
	ruleListItem: {
		width: '25vw',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem 4rem 1rem 2rem',
		borderBottom: `1px solid ${theme.fluxx.border.darker}`
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
	},
	visible: {}
});

interface Props extends WithStyles<typeof styles> {
	rules: Card[];
	users: User[];
	visible: boolean;
}

const RuleList = ({rules, users, visible, classes}: Props) => (
	<div className={`${classes.root} ${visible ? classes.visible : ''}`}>
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
				<div className={classes.ruleListItem} key={index}>
					<div className={classes.ruleTitle}>{rule.name}{paramsStr}</div>
					<div className={classes.ruleDescription}>{rule.description}</div>
				</div>
			);
		})}
	</div>
);

export default withStyles(styles)(RuleList);
