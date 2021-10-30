import { chain } from '../../src/chain';

describe('chain', () => {
	let items = [];

	const cb = item => {
		items.push(item);
		return () => {
			items.pop();
		};
	};

	it(`should call all functions in the order they were chained with the same arguments.`, () => {
		expect(items).toEqual([]);

		const restore = chain(cb('first cb'), cb('second cb'), cb('third cb'));

		expect(items).toEqual(['first cb', 'second cb', 'third cb']);

		restore();

		expect(items).toEqual([]);
	});
});
