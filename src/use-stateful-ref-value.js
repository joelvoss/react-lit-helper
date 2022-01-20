import * as React from 'react';

/**
 * useStatefulRefValue
 * @param {React.RefObject<V>} ref
 * @param {V} initialState
 * @returns {[V, (refValue: Exclude<V, null>) => void]}
 * @template V
 */
export function useStatefulRefValue(ref, initialState) {
	const [state, stateSet] = React.useState(initialState);
	let callbackRef = React.useCallback(refValue => {
		ref.current = refValue;
		stateSet(refValue);
		// NOTE(joel): We can safely silence the eslint warning since `ref` is a
		// mutable value that doesn't trigger a re-render.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return [state, callbackRef];
}
