import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	alert: {
		padding: '20px',
		backgroundColor: '#f44336',
		color: 'white',
		width: 'calc(100vw - 1.10em - 31px)',
		position: 'absolute',
		left: '3px',
		top: '48px',
		zIndex: 10
	},
	closebtn: {
		marginLeft: '15px',
		color: 'white',
		fontWeight: 'bold',
		float: 'right',
		fontSize: '22px',
		lineHeight: '20px',
		cursor: 'pointer',
		transition: '0.3s',
		'&:hover': {
			color: 'black'
		},
		zIndex: 10
	}
});

interface Props {
	onCloseAlert: () => void;
	alerts: string[];
}

class ErrorPopUp extends React.Component<Props & WithStyles<typeof styles>> {

	public render() {
		const {classes, alerts} = this.props;

		return (
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
