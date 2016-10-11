import { get } from 'lodash';

import {
	COLLECTION_SELECT,
} from '../action-types';

export const selectAllNotes = () => ( {
	type: COLLECTION_SELECT,
	collectionName: 'All Notes',
} );

export const selectTag = tag => ( {
	type: COLLECTION_SELECT,
	collectionName: get( tag, 'data.name', 'All Notes' ),
} );

export const selectTrashedNotes = () => ( {
	type: COLLECTION_SELECT,
	collectionName: 'Trash',
} );
