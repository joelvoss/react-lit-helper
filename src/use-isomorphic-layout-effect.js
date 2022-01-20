import * as React from 'react';
import { canUseDOM } from './can-use-dom';

/**
 * Taken from react-redux
 * @see https://github.com/reduxjs/react-redux/blob/master/src/utils/useIsomorphicLayoutEffect.js
 * @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
 */
export const useIsomorphicLayoutEffect = canUseDOM()
	? React.useLayoutEffect
	: React.useEffect;
