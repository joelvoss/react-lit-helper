import { noop } from '../../src/noop';

describe(`noop`, () => {
	it(`should be an empty function`, () => {
		expect(typeof noop).toEqual('function');
		expect(noop()).toEqual(undefined);
	});
});
