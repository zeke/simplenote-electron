import { combineReducers } from 'redux';

import {
	AUTH_RESET,
	AUTH_SET,
	AUTH_SET_PENDING,
} from '../action-types';

import {
	Authorized,
	Authorizing,
	NotAuthorized,
} from './constants';

const authMap = {
	[ AUTH_RESET ]: NotAuthorized,
	[ AUTH_SET ]: Authorized,
	[ AUTH_SET_PENDING ]: Authorizing,
};

export const authStatus = ( state = NotAuthorized, { type } ) =>
	type in authMap
		? authMap[ type ]
		: state;

export default combineReducers( {
	authStatus,
} );
