import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import {IntlProvider, addLocaleData} from 'react-intl';
import fi from 'react-intl/locale-data/fi';
import localeData from '../../i18n/data.json';
import App from './components/App';

addLocaleData(fi);

const rootElement = document.getElementById('root');

ReactDOM.render(
	<IntlProvider locale="fi" messages={localeData.fi}>
		<BrowserRouter>
			<Route path="/room/:id">
				<App/>
			</Route>
		</BrowserRouter>
	</IntlProvider>,
	rootElement
);
