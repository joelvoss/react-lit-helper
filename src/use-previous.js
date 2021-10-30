import { useRef, useEffect } from 'react';

/**
 * usePrevious returns the previous value of a reference after a component
 * update.
 * @param {T} value
 * @returns {T}
 * @template T
 */
export function usePrevious(value) {
	const ref = useRef(null);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}
