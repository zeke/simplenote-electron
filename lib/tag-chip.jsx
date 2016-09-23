import React from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

export const TagChip = ( { onSelect, selected, tag: tagName } ) => (
	<div
		className={ classNames( 'tag-chip', { selected } ) }
		onClick={ onSelect }
	>
		{ tagName }
	</div>
);

export default TagChip;
