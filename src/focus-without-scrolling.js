/**
 * focusWithoutScrolling focueses a given `element` without scrolling
 * the viewport. It does it by either using the `preventScroll` option
 * or tracks `scrollTop`/`scrollLeft` properties of all scrollable elements
 * up the DOM hierarchy.
 * @param {HTMLElement} element
 */
export function focusWithoutScrolling(element) {
	if (supportsPreventScroll()) {
		element.focus({ preventScroll: true });
	} else {
		// NOTE(joel): Gather all scrollable elements starting from `element` up
		// and save their current scroll position.
		const scrollableElements = getScrollableElements(element);

		element.focus();

		// NOTE(joel): Restore scroll position of all scrollable elements.
		for (let { element, scrollTop, scrollLeft } of scrollableElements) {
			element.scrollTop = scrollTop;
			element.scrollLeft = scrollLeft;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} ScrollableElement
 * @prop {HTMLElement} element
 * @prop {number} scrollTop
 * @prop {number} scrollLeft
 */

/**
 * getScrollableElements
 * @param {HTMLElement} element
 * @returns {ScrollableElement[]}
 */
function getScrollableElements(element) {
	let parent = element.parentNode;
	/** @type {ScrollableElement[]} */
	let scrollableElements = [];
	let rootScrollingElement =
		document.scrollingElement || document.documentElement;

	while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
		if (
			parent.offsetHeight < parent.scrollHeight ||
			parent.offsetWidth < parent.scrollWidth
		) {
			scrollableElements.push({
				element: parent,
				scrollTop: parent.scrollTop,
				scrollLeft: parent.scrollLeft,
			});
		}
		parent = parent.parentNode;
	}

	if (rootScrollingElement instanceof HTMLElement) {
		scrollableElements.push({
			element: rootScrollingElement,
			scrollTop: rootScrollingElement.scrollTop,
			scrollLeft: rootScrollingElement.scrollLeft,
		});
	}

	return scrollableElements;
}

////////////////////////////////////////////////////////////////////////////////

let supportsPreventScrollCached = null;

/**
 * supportsPreventScroll tests if the current document supports the
 * `preventScroll` option on `.focus()`
 */
function supportsPreventScroll() {
	if (supportsPreventScrollCached == null) {
		supportsPreventScrollCached = false;
		try {
			let focusElem = document.createElement('div');
			focusElem.focus({
				get preventScroll() {
					supportsPreventScrollCached = true;
					return true;
				},
			});
		} catch (err) {
			// silence is golden
		}
	}

	return supportsPreventScrollCached;
}
