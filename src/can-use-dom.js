/**
 * canUseDOM checks weather or not the current environment can use the DOM.
 * @returns {boolean}
 */
export function canUseDOM() {
	return !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);
}
