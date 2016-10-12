import {
	memoize,
} from 'lodash';

export class SingleCache {
	delete() {
		return false;
	}

	get() {
		return this.value;
	}

	has( key ) {
		return key === this.key;
	}

	set( key, value ) {
		this.key = key;
		this.vale = value;

		return this;
	}
}

export const memoizeSingle = memoize.bind( null );
memoizeSingle.Cache = SingleCache;

export default memoizeSingle;
