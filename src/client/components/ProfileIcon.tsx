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

import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

interface Props {
	image: 'default' | string;
	imagecss: string;
	userId: string;
}

const ProfileIcon = (props: Props) => {
	if (props.image !== 'default') {
		return <img className={props.imagecss} src={props.image} width="40" height="40"/>;
	}

	let seed = 1;
	let i = 1;
	for (const char of props.userId) {
		seed += char.charCodeAt(0) * i++;
	}
	// https://stackoverflow.com/a/19303725/4194997
	function random(): number {
		const x = Math.sin(seed++);
		return x * 10000 - Math.floor(x * 10000);
	}

	return (
		<SvgIcon viewBox="0 0 64 64">
			<defs>
				<clipPath id="circle">
					<circle cx="32" cy="32" r="32"/>
				</clipPath>
			</defs>
			<circle cx="32" cy="32" r="32" fill="#fff" clip-path="url(#circle)"/>
			<circle cx={random() * 64} cy={random() * 64} r={random() * 32} fill={'#' + Math.floor(random() * 4095).toString(16)} clip-path="url(#circle)"/>
			<circle cx={random() * 64} cy={random() * 64} r={random() * 32} fill={'#' + Math.floor(random() * 4095).toString(16)} clip-path="url(#circle)"/>
			<circle cx={random() * 64} cy={random() * 64} r={random() * 32} fill={'#' + Math.floor(random() * 4095).toString(16)} clip-path="url(#circle)"/>
			<circle cx={random() * 64} cy={random() * 64} r={random() * 32} fill={'#' + Math.floor(random() * 4095).toString(16)} clip-path="url(#circle)"/>
			<circle cx={random() * 64} cy={random() * 64} r={random() * 32} fill={'#' + Math.floor(random() * 4095).toString(16)} clip-path="url(#circle)"/>
		</SvgIcon>
	);
};

export default ProfileIcon;
