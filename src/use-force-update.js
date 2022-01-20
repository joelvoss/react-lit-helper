import * as React from 'react';

/**
 * Forces a re-render, similar to `forceUpdate` in class components.
 * @returns {() => void}
 */
export function useForceUpdate() {
	// NOTE(joel): Keep the state value as light as possible and break
	// equality checks when re-assigning a new value at the same time
	// (a number counting up may eventually reach the integer boundary; instead
	// we're using a null-object).
	let [, dispatch] = React.useState(Object.create(null));
	return React.useCallback(() => {
		dispatch(Object.create(null));
	}, []);
}
