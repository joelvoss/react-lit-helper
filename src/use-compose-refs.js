import * as React from 'react';
import { isFunction } from './type-check';

/**
 * assignRef assigns an arbitrary value to a ref function or object.
 * @param {React.MutableRefObject<T | null>} [ref]
 * @param {any} [value]
 * @template T
 */
export function assignRef(ref, value) {
	if (ref == null) return;
	if (isFunction(ref)) {
		ref(value);
	} else {
		try {
			ref.current = value;
		} catch (error) {
			throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
		}
	}
}

/**
 * useComposeRefs assigns a value to multiple refs (typically a DOM
 * node). Useful for dealing with components that need an explicit ref for DOM
 * calculations but also forwards refs assigned by a parent component.
 * @param {React.MutableRefObject<T | null>[]} refs
 * @template T
 */
export function useComposeRefs(...refs) {
	return React.useCallback(node => {
		for (let ref of refs) {
			assignRef(ref, node);
		}
		// NOTE(joel): The lint rule can't statically verify whether we've passed
		// the correct dependencies here. Since we know what we're doing, we can
		// safely disable the lint rule.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, refs);
}
