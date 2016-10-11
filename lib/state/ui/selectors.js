import { get } from 'lodash';

export const getSelectedCollection = state =>
	get( state, 'ui.selectedCollection', 'All Notes' );
