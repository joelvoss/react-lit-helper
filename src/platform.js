/**
 * testUserAgent tests, if a given RegExp matches the current
 * `window.navigator.userAgent` string.
 * @param {RegExp} re
 */
function testUserAgent(re) {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test(window.navigator.userAgent)
		: false;
}

/**
 * testPlatform tests, if a given RegExp matches the current
 * `window.navigator.platform` string.
 * @param {RegExp} re
 */
function testPlatform(re) {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test(window.navigator.platform)
		: false;
}

export function isMac() {
	return testPlatform(/^Mac/);
}

export function isIPhone() {
	return testPlatform(/^iPhone/);
}

export function isIPad() {
	return (
		testPlatform(/^iPad/) ||
		// NOTE(joel): iPadOS 13 says it's a Mac, but we can distinguish by
		// detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

export function isIOS() {
	return isIPhone() || isIPad();
}

export function isAppleDevice() {
	return isMac() || isIOS();
}

export function isWebKit() {
	return testUserAgent(/AppleWebKit/) && !isChrome();
}

export function isChrome() {
	return testUserAgent(/Chrome/);
}

export function isAndroid() {
	return testUserAgent(/Android/);
}
