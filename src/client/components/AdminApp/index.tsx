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
import {hot} from 'react-hot-loader/root';
import {snakeCase} from 'lodash';
import {withStyles, WithStyles, createStyles, Theme, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper} from '@material-ui/core';
import axios from 'axios';
import AceEditor from 'react-ace';
import Login from './Login';

import 'brace/mode/sql';
import 'brace/theme/tomorrow';

const styles = (theme: Theme) => createStyles({
	root: {
		background: theme.fluxx.body.background,
		fontSize: '1.6rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	loginContainer: {
		display: 'flex',
		flex: '0 0 60rem',
		padding: '5rem 0'
	},
	queryContainer: {
		display: 'flex',
		padding: '4rem',
		width: '100%',
		flex: '0 0 auto',
		boxSizing: 'border-box'
	},
	queryEditor: {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 60rem',
		backgroundColor: '#fff',
		padding: '2rem',
		marginRight: '1rem'
	},
	queryResponseContainer: {
		display: 'flex',
		flex: '1 1 100rem',
		overflow: 'auto',
		backgroundColor: '#fff',
		marginLeft: '1rem'
	},
	queryResponseRow: {},
	queryResponseCell: {
		maxWidth: '16rem',
		'$queryResponseRow:hover &': {
			wordBreak: 'break-word'
		},
		'$queryResponseRow:not(:hover) &': {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		}
	}
});

interface State {
	query: string;
	queryResponse: Array<{[col: string]: string | boolean | number | null}>;
}

class AdminApp extends React.Component<WithStyles<typeof styles>, State> {
	public state: State = {
		query: localStorage.getItem('query') || `SELECT name FROM sqlite_master WHERE type ='table'`,
		queryResponse: []
	};

	public handleLogin = async (username: string, password: string) => {
		const authorization = new Buffer(`${username}:${password}`).toString('base64');
		const url = window.env.ADMIN_API_URL || 'http://localhost:3000/admin';
		const {data} = await axios({
			url: `${url}/token`,
			method: 'post',
			headers: {
				Authorization: `Basic ${authorization}`
			}
		});

		localStorage.setItem('token', data.data.accessToken);
		this.forceUpdate();
	};

	public isLoggedIn = () => {
		return Boolean(localStorage.getItem('token'));
	}

	public handleChangeQuery = (value: string) => {
		localStorage.setItem('query', value);
		this.setState({query: value});
	}

	public handleSubmitQuery = async () => {
		const url = window.env.ADMIN_API_URL || 'http://localhost:3000/admin';

		try {
			const {data} = await axios({
				url: `${url}/query`,
				method: 'post',
				data: {
					query: this.state.query
				},
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			this.setState({queryResponse: data.data});
		} catch (err) {
			const response = err.response.data;
			if (response.error) {
				if (response.error.status === 401) {
					localStorage.removeItem('token');
					this.forceUpdate();
				} else {
					console.error(response.error.message); // tslint:disable-line:no-console
				}
			}
		}
	}

	public render() {
		const {classes} = this.props;
		const loggedIn = this.isLoggedIn();

		const queryResponseColumns = Object.keys(this.state.queryResponse[0] || {});

		return (
			<div className={classes.root}>
				{!loggedIn && (
					<div className={classes.loginContainer}>
						<Login onLogin={this.handleLogin} />
					</div>
				)}
				{loggedIn && (
					<div className={classes.queryContainer}>
						<Paper className={classes.queryEditor}>
							<AceEditor
								mode="sql"
								theme="tomorrow"
								onChange={this.handleChangeQuery}
								fontSize={14}
								width="100%"
								height="100%"
								showPrintMargin={true}
								showGutter={true}
								highlightActiveLine={true}
								value={this.state.query}
								setOptions={{
									enableBasicAutocompletion: false,
									enableLiveAutocompletion: true,
									enableSnippets: false,
									showLineNumbers: true,
									tabSize: 2
								}}
							/>
							<Button onClick={this.handleSubmitQuery}>Submit</Button>
						</Paper>
						<Paper className={classes.queryResponseContainer}>
							<Table>
								<TableHead>
									<TableRow>
										{queryResponseColumns.map(col => (
											<TableCell key={col}>{snakeCase(col)}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.queryResponse.map((row, rowIndex) => (
										<TableRow key={rowIndex} className={classes.queryResponseRow}>
											{queryResponseColumns.map(col => (
												<TableCell
													key={`${rowIndex}-${col}`}
													className={classes.queryResponseCell}
												>
													{row[col]}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</div>
				)}
			</div>
		);
	}
}

export default hot(withStyles(styles)(AdminApp));
