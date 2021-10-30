import { useLayoutEffect, useEffect } from 'react';

describe(`use-isomorphic-layout-effect`, () => {
	beforeEach(() => jest.resetModules());

	it(`should return useLayoutEffect client side`, () => {
		jest.mock('../../src/can-use-dom', () => ({ canUseDOM: () => true }));
		const {
			useIsomorphicLayoutEffect,
		} = require('../../src/use-isomorphic-layout-effect');
		expect(useIsomorphicLayoutEffect.toString()).toBe(
			useLayoutEffect.toString(),
		);
	});
	it(`should return useEffect server side`, () => {
		jest.mock('../../src/can-use-dom', () => ({ canUseDOM: () => false }));
		const {
			useIsomorphicLayoutEffect,
		} = require('../../src/use-isomorphic-layout-effect');
		expect(useIsomorphicLayoutEffect.toString()).toBe(useEffect.toString());
	});
});
