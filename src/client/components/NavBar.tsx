import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	navbarBack: {
		height: '31px',
		padding: '7px',
		marginLeft: '-0.55em',
		marginTop: '-0.55em',
		marginBottom: '3px',
		background: theme.fluxx.palette.primary
	},
	navbarFront: {
		fontSize: '25px',
		color: theme.fluxx.palette.contrast
	}
});

const NavigationBar = withStyles(styles)(
	({classes}: WithStyles<typeof styles>) => (
		<nav className={classes.navbarBack}>
			<a className={classes.navbarFront}>FluxxChat</a>
		</nav>
	)
);

export default NavigationBar;
