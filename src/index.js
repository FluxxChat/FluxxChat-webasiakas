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

const path = require('path');
const express = require('express');

const app = express();

const distFolder = path.resolve(__dirname, '../dist');

app.use(express.static(path.resolve(distFolder, 'client')));

const BROWSER_ENV_PREFIX = 'BROWSER_';

app.get('/env.js', (_req, res) => {
	/* Transform environment variables that start with BROWSER_ENV_PREFIX into a
	 * `key1:env1,key2:env2` string.
	 */
	const envStr = Object.keys(process.env)
		.filter(key => key.startsWith(BROWSER_ENV_PREFIX))
		.map(key => `${key.substr(BROWSER_ENV_PREFIX.length)}:'${process.env[key]}'`)
		.join(',');
	res.end(`window.env = {${envStr}}`);
});

// Fallback to index.html
app.get(/^(\/.*)?$/, (_req, res) => {
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', '0');
	res.sendFile(path.resolve(distFolder, 'client/index.html'));
});

const port = parseInt(process.env.PORT || '8888', 10);
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
