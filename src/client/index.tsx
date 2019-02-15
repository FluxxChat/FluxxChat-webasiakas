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
