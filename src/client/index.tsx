import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import App from './components/App';

const rootElement = document.getElementById('root');

ReactDOM.render(
	<BrowserRouter>
		<Route path="/room/:id">
			<App/>
		</Route>
	</BrowserRouter>,
	rootElement
);
