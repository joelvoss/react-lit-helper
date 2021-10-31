import { isRightClick } from '../../src/is-right-click';

describe(`isRightClick`, () => {
	it(`should detect a right click`, () => {
		const leftClick = new MouseEvent('click');
		const rightClick = new MouseEvent('click', { which: 3, button: 2 });

		expect(isRightClick(leftClick)).toBe(false);
		expect(isRightClick(rightClick)).toBe(true);
	});
});
