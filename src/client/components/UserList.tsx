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
import {createStyles, withStyles, WithStyles, CircularProgress, Theme} from '@material-ui/core';
import {User} from 'fluxxchat-protokolla';
import ProfileIcon from './ProfileIcon';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '30rem',
		flex: 1,
		overflowY: 'auto',
		maxHeight: '65vh'
	},
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		padding: '0 2rem',
		flex: '0 0 6rem',
		fontSize: '1.2rem',
		fontWeight: 500,
		color: '#ffffffdd',
		'&$highlight': {
			background: theme.fluxx.users.user.highlight.background
		}
	},
	profileIcon: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		'& > svg': {
			fontSize: '4rem'
		}
	},
	profileIconImg: {
		overflow: 'hidden',
		borderRadius: '50%'
	},
	turnProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%) rotate(-90deg) !important'
	},
	userNickname: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
		paddingLeft: '1.6rem',
		'$highlight &': {
			color: '#95c8ef'
		}
	},
	highlight: {}
});

interface Props extends WithStyles<typeof styles> {
	users: User[];
	clientUser: User;
	turnUser: User;
	turnTimePercent: number;
}

const UserList = ({clientUser, turnUser, users, classes, turnTimePercent}: Props) => (
	<div className={classes.root}>
		{users.map(u => (
			<div
				key={u.id}
				className={`${classes.listItem} ${u.id === clientUser.id ? classes.highlight : ''}`}
			>
				<div className={classes.profileIcon}>
					<ProfileIcon imagecss={classes.profileIconImg} image={u.profileImg} userId={u.nickname}/>
					{u.id === turnUser.id && (
						<CircularProgress
							className={classes.turnProgress}
							variant="static"
							value={turnTimePercent}
							size={52}
						/>
					)}
				</div>
				<div className={classes.userNickname}>{u.nickname}</div>
			</div>
		))}
	</div>
);

export default withStyles(styles)(UserList);
