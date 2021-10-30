import { getDocumentDimensions } from '../../src/get-document-dimensions';

describe('getDocumentDimensions', () => {
	let windowSpy;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, 'window', 'get');
	});

	afterEach(() => {
		windowSpy.mockRestore();
	});

	it(`should return clientWidth/clientHeight`, () => {
		let resetDimensions;
		try {
			resetDimensions = setDocumentDimensions(300, 150);
			expect(getDocumentDimensions()).toEqual({ width: 300, height: 150 });
		} finally {
			resetDimensions();
		}
	});

	it(`should fallback to the windows innerWidth/innerHeight`, () => {
		let resetDimensions;
		try {
			resetDimensions = setDocumentDimensions(null, null);
			// NOTE(joel): 1024x768 are jsdom window.innerWidth/innerHeight defaults
			expect(getDocumentDimensions()).toEqual({ width: 1024, height: 768 });
		} finally {
			resetDimensions();
		}
	});

	it(`should return zero without browser/jsdom globals`, () => {
		windowSpy.mockImplementation(() => undefined);
		expect(getDocumentDimensions()).toEqual({ width: 0, height: 0 });
	});
});

////////////////////////////////////////////////////////////////////////////////

/**
 * setDocumentDimensions sets current document clientWidth/clientHeight values
 * and returns a reset function.
 * @param {number|null} w 
 * @param {number|null} h 
 * @returns {() => void}
 */
function setDocumentDimensions(w, h) {
	Object.defineProperty(document.documentElement, 'clientWidth', {
		writable: true,
		configurable: true,
		value: w,
	});
	Object.defineProperty(document.documentElement, 'clientHeight', {
		writable: true,
		configurable: true,
		value: h,
	});

	// Reset
	return () => {
		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			configurable: true,
			value: 0,
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			writable: true,
			configurable: true,
			value: 0,
		});
	};
}
