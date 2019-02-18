import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const ProfileIcon = (props: any) => (
	<SvgIcon {...props} viewBox="0 0 64 64">
		<defs>
			<clipPath id="a">
				<path fill="#e9c6af" stroke-width="0" d="M35 229l53-15c2-9 3-22-10-39l-4-2c-3-3-6-17-1-19v-31c1-15 11-28 28-28h15c18 0 25 14 25 28l1 30c4 5 2 17-1 20l-4 2c-11 17-11 30-10 38l53 14c-31 30-101 39-145 2z"/>
			</clipPath>
		</defs>
		<g transform="matrix(.30978 0 0 .30921 482 106)">
			<circle cx="-1451" cy="-238" r="103" fill="#556080"/>
			<circle cx="105" cy="147" r="103" fill="#e7eced" clip-path="url(#a)" transform="translate(-1557 -385)"/>
		</g>
	</SvgIcon>
);

export default ProfileIcon;
