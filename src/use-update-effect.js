import * as React from 'react';

/**
 * useUpdateEffect calls an effect after a component update, skipping the
 * initial mount.
 * @param {React.EffectCallback} effect
 * @param {React.DependencyList} deps
 */
export function useUpdateEffect(effect, deps) {
	const mounted = React.useRef(false);
	React.useEffect(() => {
		if (mounted.current) {
			effect();
		} else {
			mounted.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
