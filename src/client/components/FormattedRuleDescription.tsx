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
	// If rule.values contains a field named array, the 'elements' of the array string will be treated as messages to be translated.
	// This enables localization of lists of localized messages as in the case of disabling rule descriptions,
	// e.g. "Disables the following rules: Markdown Formatting"
	if (rule.values) {
		if (Object.keys(rule.values).indexOf('array') > -1) {
			const arrayStr = (rule.values as { array: string }).array;
			const array = arrayStr.split(', ');
			array.forEach((message, i) => {
				description.push(<FormattedMessage id={message} key={`${i}-message`} />);
				description.push(<span key={`${i}-span`}>, </span>);
			});
			description.pop();
			description.push(<span>.</span>);
		}
	}
	return <span>{description}</span>;
};
