import { getOwnerDocument } from '../../src/get-owner-document';

describe('getOwnerDocument', () => {
	let windowSpy;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, 'window', 'get');
	});

	afterEach(() => {
		windowSpy.mockRestore();
	});

	it(`should return the owner document`, () => {
		expect(getOwnerDocument()).toBe(document);
	});
	
	it(`should return the owner document of the passed element`, () => {
		const element = document.createElement('div');
		const doc = getOwnerDocument(element)

		expect(doc).toBe(document);
		expect(element.ownerDocument).toBe(doc);
	});

	it(`should return null without browser/jsdom globals`, () => {
		windowSpy.mockImplementation(() => undefined);
		const element = document.createElement('div');

		expect(getOwnerDocument()).toBe(null);
		expect(getOwnerDocument(element)).toBe(null);
	});
});
