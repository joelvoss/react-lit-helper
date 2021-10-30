import { useRef, useEffect, useCallback } from 'react';
import { useIsomorphicLayoutEffect as useLayoutEffect } from './use-isomorphic-layout-effect';

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop and exposed as a stable function to avoid executing effects when
 * passed as a dependency.
 * @param {(effect: React.EffectCallback, deps?: React.DependencyList | undefined) => any} useEffectHook
 * @param {T extends (...args: any[]) => any} callback
 * @returns {T}
 * @template T
 */
function useStableCallbackHook(useEffectHook, callback) {
	let callbackRef = useRef(callback);
	useEffectHook(() => {
		callbackRef.current = callback;
	});

	return useCallback((...args) => {
		callbackRef.current && callbackRef.current(...args);
	}, []);
}

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop and exposed as a stable function to avoid executing effects when
 * passed as a dependency. The callback is cached in `useEffect`.
 * @param {T extends (...args: any[]) => any} callback
 * @returns {T}
 * @template T
 */
export function useStableCallback(callback) {
	return useStableCallbackHook(useEffect, callback);
}

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop and exposed as a stable function to avoid executing effects when
 * passed as a dependency. The callback is cached in `useLayoutEffect`.
 * @param {T extends (...args: any[]) => any} callback
 * @returns {T}
 * @template T
 */
export function useStableLayoutCallback(callback) {
	return useStableCallbackHook(useLayoutEffect, callback);
}
