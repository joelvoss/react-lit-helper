import { canUseDOM } from '../../src/can-use-dom';

describe('canUseDOM', () => {
	let windowSpy;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, 'window', 'get');
	});

	afterEach(() => {
		windowSpy.mockRestore();
	});

	it(`should return true with browser/jsdom globals`, () => {
		expect(canUseDOM()).toBe(true);
	});

	it(`should return false without browser/jsdom globals`, () => {
		windowSpy.mockImplementation(() => undefined);
		expect(canUseDOM()).toBe(false);
	});
});
