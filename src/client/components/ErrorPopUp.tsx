import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	alert: {
		padding: '20px',
		backgroundColor: theme.fluxx.alert.body.backgroundColor,
		color: theme.fluxx.alert.body.color,
		width: 'calc(100vw - 1.10em - 31px)',
		position: 'absolute',
		left: '3px',
		top: '3px',
		border: '1px solid transparent',
		borderRadius: '3px',
		zIndex: 1000000000
	},
	closebtn: {
		marginLeft: '15px',
		color: theme.fluxx.alert.button.normalcolor,
		fontWeight: 'bold',
		float: 'right',
		fontSize: '22px',
		lineHeight: '20px',
		cursor: 'pointer',
		transition: '0.3s',
		'&:hover': {
			color: theme.fluxx.alert.button.hovercolor
		},
		zIndex: 1000000000
	}
});

interface Props {
	onCloseAlert: () => void;
	alerts: string[];
}

class ErrorPopUp extends React.Component<Props & WithStyles<typeof styles>> {

	public render() {
		const {classes, alerts} = this.props;

		return ( // return
			<div className={classes.alert}>
				<span className={classes.closebtn} onClick={this.props.onCloseAlert}>&times;</span>
					{alerts.map((alert, index) => {
						return (
							<div key={index}>{alert}</div>
						);
					})}
			</div>
		);
	}
}

const ErrorPopUpWithProps = withStyles(styles)(ErrorPopUp);

export default ErrorPopUpWithProps;
