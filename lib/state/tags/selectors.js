import {
	get,
	matchesProperty,
	partialRight,
	property,
	sortBy,
	uniqBy,
} from 'lodash';

import memoizeSingle from '../../utils/memoize-single';
import { getSelectedCollection } from '../ui/selectors';

const tagName = property( 'data.name' );
const tagSort = partialRight( get, 'data.index', Infinity );
const tagSorter = memoizeSingle( partialRight( sortBy, tagSort ) );

export const getTags = state => tagSorter( state.tags );

export const getSelectedTag = state => {
	const selectedCollection = getSelectedCollection( state );
	const matchesSelectedTag = matchesProperty( 'data.name', selectedCollection );
	const tags = getTags( state );

	return tags.find( matchesSelectedTag );
};
