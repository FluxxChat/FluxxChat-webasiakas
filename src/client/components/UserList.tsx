import React from 'react';
import {createStyles, withStyles, WithStyles, CircularProgress, Theme} from '@material-ui/core';
import {User} from 'fluxxchat-protokolla';
import ProfileIcon from './ProfileIcon';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '30rem',
		flex: 1
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
					<ProfileIcon/>
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
