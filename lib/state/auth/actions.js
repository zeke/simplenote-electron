import { partial } from 'lodash';

import { AUTH_SET } from '../action-types';

import {
	Authorized,
	Authorizing,
	InvalidCredentials,
	LoginError,
	NotAuthorized,
} from '../action-types';

const setAuthStatus = status => ( {
	type: AUTH_SET,
	status,
} );

export const reset = partial( setAuthStatus, NotAuthorized );
export const setInvalidCredentials = partial( setAuthStatus, InvalidCredentials );
export const setLoginError = partial( setAuthStatus, LoginError );
export const setPending = partial( setAuthStatus, Authorizing );
export const setAuthorized = partial( setAuthStatus, Authorized );
