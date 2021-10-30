import { makeId } from '../../src/make-id';

describe(`makeId`, () => {
	it(`should concat values to form an ID`, () => {
		expect(makeId('one', 'two', 3)).toEqual('one--two--3');
		expect(makeId('one', 'two')).toEqual('one--two');
		expect(makeId('one', null, 'three')).toEqual('one--three');
		expect(makeId('one')).toEqual('one');
		expect(makeId()).toEqual('');
		expect(makeId(null)).toEqual('');
		expect(makeId(undefined)).toEqual('');
	});
});
