import {
	isMac,
	isIPhone,
	isIPad,
	isIOS,
	isAppleDevice,
	isWebKit,
	isChrome,
	isAndroid,
} from '../../src/platform';

describe(`isMac`, () => {
	it(`should detect the 'Mac' platform`, () => {
		let resetPlatform;
		try {
			resetPlatform = setPlatform('MacIntel');
			expect(isMac()).toEqual(true);

			setPlatform('Win32');
			expect(isMac()).toEqual(false);
		} finally {
			resetPlatform();
		}
	});
});

describe(`isIPhone`, () => {
	it(`should detect the 'iPhone' platform`, () => {
		let resetPlatform;
		try {
			resetPlatform = setPlatform('iPhone');
			expect(isIPhone()).toEqual(true);

			setPlatform('MacIntel');
			expect(isIPhone()).toEqual(false);
		} finally {
			resetPlatform();
		}
	});
});

describe(`isIPad`, () => {
	it(`should detect the 'isIPad' platform`, () => {
		let resetPlatform, resetMaxTouchPoints;
		try {
			resetPlatform = setPlatform('iPad');
			expect(isIPad()).toEqual(true);

			setPlatform('MacIntel');
			expect(isIPad()).toEqual(false);

			resetMaxTouchPoints = setMaxTouchPoints(2);
			expect(isIPad()).toEqual(true);
		} finally {
			resetPlatform();
			resetMaxTouchPoints();
		}
	});
});

describe(`isIOS`, () => {
	it(`should detect the 'isIOS' platform`, () => {
		let resetPlatform, resetMaxTouchPoints;
		try {
			resetPlatform = setPlatform('iPhone');
			expect(isIOS()).toBe(true);

			setPlatform('iPad');
			expect(isIOS()).toBe(true);

			setPlatform('MacIntel');
			expect(isIOS()).toBe(false);

			resetMaxTouchPoints = setMaxTouchPoints(2);
			expect(isIOS()).toBe(true);
		} finally {
			resetPlatform();
			resetMaxTouchPoints();
		}
	});
});

describe(`isAppleDevice`, () => {
	it(`should detect the 'isAppleDevice' platform`, () => {
		let resetPlatform;
		try {
			resetPlatform = setPlatform('iPhone');
			expect(isAppleDevice()).toBe(true);

			setPlatform('iPad');
			expect(isAppleDevice()).toBe(true);

			setPlatform('MacIntel');
			expect(isAppleDevice()).toBe(true);

			setPlatform('Win32');
			expect(isAppleDevice()).toBe(false);
		} finally {
			resetPlatform();
		}
	});
});

describe(`isWebKit`, () => {
	const chromeUA =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
	const webkitUA =
		'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

	it(`should detect a 'webkit' userAgent`, () => {
		let resetUserAgent;
		try {
			resetUserAgent = setUserAgent(webkitUA);
			expect(isWebKit()).toBe(true);

			setUserAgent(chromeUA);
			expect(isWebKit()).toBe(false);
		} finally {
			resetUserAgent();
		}
	});
});

describe(`isChrome`, () => {
	const chromeUA =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
	const webkitUA =
		'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

	it(`should detect a 'chrome' userAgent`, () => {
		let resetUserAgent;
		try {
			resetUserAgent = setUserAgent(chromeUA);
			expect(isChrome()).toBe(true);

			setUserAgent(webkitUA);
			expect(isChrome()).toBe(false);
		} finally {
			resetUserAgent();
		}
	});
});

describe(`isAndroid`, () => {
	const androidUA =
		'Mozilla/5.0 (Linux; U; Android 2.2) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
	const webkitUA =
		'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

	it(`should detect a 'android' userAgent`, () => {
		let resetUserAgent;
		try {
			resetUserAgent = setUserAgent(androidUA);
			expect(isAndroid()).toBe(true);

			setUserAgent(webkitUA);
			expect(isAndroid()).toBe(false);
		} finally {
			resetUserAgent();
		}
	});
});

////////////////////////////////////////////////////////////////////////////////

function setPlatform(str) {
	const oldValue = window.navigator.platform;
	Object.defineProperty(window.navigator, 'platform', {
		writable: true,
		configurable: true,
		value: str,
	});
	// Reset
	return () => {
		Object.defineProperty(window.navigator, 'platform', {
			writable: true,
			configurable: true,
			value: oldValue,
		});
	};
}

////////////////////////////////////////////////////////////////////////////////

function setMaxTouchPoints(num) {
	const oldValue = window.navigator.maxTouchPoints;
	Object.defineProperty(window.navigator, 'maxTouchPoints', {
		writable: true,
		configurable: true,
		value: num,
	});
	// Reset
	return () => {
		Object.defineProperty(window.navigator, 'maxTouchPoints', {
			writable: true,
			configurable: true,
			value: oldValue,
		});
	};
}

////////////////////////////////////////////////////////////////////////////////

function setUserAgent(str) {
	const oldValue = window.navigator.userAgent;
	Object.defineProperty(window.navigator, 'userAgent', {
		writable: true,
		configurable: true,
		value: str,
	});
	// Reset
	return () => {
		Object.defineProperty(window.navigator, 'userAgent', {
			writable: true,
			configurable: true,
			value: oldValue,
		});
	};
}
