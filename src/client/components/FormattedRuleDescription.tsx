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
import { FormattedMessage } from 'react-intl';
import { Card } from 'fluxxchat-protokolla';

interface Props {
	rule: Card;
}

// A workaround for getting dynamically generated descriptions of disabling rules to be translated properly
export const FormattedRuleDescription = ({ rule }: Props) => {
	const description: JSX.Element[] = [];
	description.push(<FormattedMessage id={rule.description} values={rule.values} />);
	if (rule.values) {
		if (Object.keys(rule.values).indexOf('titles') > -1) {
			const titlesStr = (rule.values as { titles: string }).titles;
			const titles = titlesStr.split(', ');
			for (const title of titles) {
				description.push(<FormattedMessage id={title} />);
				description.push(<span>, </span>);
			}
			description.pop();
			description.push(<span>.</span>);
		}
	}
	return <span>{description}</span>;
};
