import { useIsomorphicLayoutEffect as useLayoutEffect } from './use-isomorphic-layout-effect';
import { isIOS } from './platform';
import { chain } from './chain';

const visualViewport = typeof window !== 'undefined' && window.visualViewport;

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
	'checkbox',
	'radio',
	'range',
	'color',
	'file',
	'image',
	'button',
	'submit',
	'reset',
]);

/**
 * Prevents scrolling on the document body on mount, and restores it on
 * unmount. Also ensures that content does not shift due to the scrollbars
 * disappearing.
 * @param {boolean} [enabled=true]
 */
export function usePreventScroll(enabled = true) {
	useLayoutEffect(() => {
		if (!enabled) return;

		if (isIOS()) return preventScrollMobileSafari();
		return preventScrollStandard();
	}, [enabled]);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * preventScrollStandard prevents scrolling for most browser by setting
 * `overflow:hidden` on the root element and add some padding to prevent the
 * page from shifting when the scrollbar is hidden.
 */
function preventScrollStandard() {
	return chain(
		setStyle(
			document.documentElement,
			'paddingRight',
			`${window.innerWidth - document.documentElement.clientWidth}px`,
		),
		setStyle(document.documentElement, 'overflow', 'hidden'),
	);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * preventScrollMobileSafari prevents scrolling for mobile Safari.
 *
 * Note: Mobile Safari is a whole different beast. Even with overflow: hidden,
 * it still scrolls the page in many situations:
 *  1. When the bottom toolbar and address bar are collapsed, page scrolling is
 *     always allowed.
 *  2. When the keyboard is visible, the viewport does not resize. Instead, the
 *     keyboard covers part of it, so it becomes scrollable.
 *  3. When tapping on an input, the page always scrolls so that the input is
 *     centered in the visual viewport.
 *     This may cause even fixed position elements to scroll off the screen.
 *  4. When using the next/previous buttons in the keyboard to navigate between
 *     inputs, the whole page always scrolls, even if the input is inside a
 *     nested scrollable element that could be scrolled instead.
 *
 * In order to work around these cases, and prevent scrolling without
 * jankiness, we do a few things:
 *  1. Prevent default on `touchmove` events that are not in a scrollab
 *     element. This prevents touch scrolling on the window.
 *  2. Prevent default on `touchmove` events inside a scrollable element when
 *     the scroll position is at the top or bottom. This avoids the whole page
 *     scrolling instead, but does prevent overscrolling.
 *  3. Prevent default on `touchend` events on input elements and handle
 *     focusing the element ourselves.
 *  4. When focusing an input, apply a transform to trick Safari into thinking
 *     the input is at the top of the page, which prevents it from scrolling
 *     the page. After the input is focused, scroll the element into view
 *     ourselves, without scrolling the whole page.
 *  5. Offset the body by the scroll position using a negative margin and
 *     scroll to the top. This should appear the same visually, but makes the
 *     actual scroll position always zero. This is required to make all of the
 *     above work or Safari will still try to scroll the page when focusing
 *     an input.
 *  6. As a last resort, handle window scroll events, and scroll back to the
 *     top. This can happen when attempting to navigate to an input with the
 *     next/previous buttons that's outside a modal.
 */

function preventScrollMobileSafari() {
	/** @type {Element} */
	let scrollable;
	let lastY = 0;

	/**
	 * onTouchStart stores the nearest scrollable parent element from the element
	 * that the user touched.
	 * @param {TouchEvent} evt
	 */
	const onTouchStart = evt => {
		scrollable = getScrollParent(evt.target);
		if (
			scrollable === document.documentElement &&
			scrollable === document.body
		) {
			return;
		}

		lastY = evt.changedTouches[0].pageY;
	};

	/**
	 * onTouchEnd prevents scrolling the window.
	 * Prevent scrolling up when at the top and scrolling down when at the bottom
	 * of anested scrollable area, otherwise mobile Safari will start scrlling
	 * the window instead. Unfortunately, this disables bounce scrolling when at
	 * the tip but it's the best we can do.
	 * @param {TouchEvent} evt
	 */
	const onTouchMove = evt => {
		if (
			scrollable === document.documentElement ||
			scrollable === document.body
		) {
			evt.preventDefault();
			return;
		}

		let y = evt.changedTouches[0].pageY;
		let scrollTop = scrollable.scrollTop;
		let bottom = scrollable.scrollHeight - scrollable.clientHeight;

		if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
			evt.preventDefault();
		}

		lastY = y;
	};

	/**
	 * onTouchEnd applys a transform to trick Safari into thingking the input is
	 * at the top of the page so it doesn't try to scroll it into view.
	 * When tapping on an input, this needs to be done before the "focus" event,
	 * so we have to focus the element ourselves.
	 * @param {TouchEvent} e
	 */
	let onTouchEnd = e => {
		let target = e.target;
		if (
			target instanceof HTMLInputElement &&
			!nonTextInputTypes.has(target.type)
		) {
			e.preventDefault();

			target.style.transform = 'translateY(-2000px)';
			target.focus();
			window.requestAnimationFrame(() => {
				target.style.transform = '';
			});
		}
	};

	/**
	 * onFocus applieds a transform in the focus event in cases where focus moves
	 * other than tapping on an input directly, e.g. the next/previous buttons in
	 * the software keyboard. In these cases, it seems applying the transform in
	 * the focus event is good enough, whereas when tapping an input, it must be
	 * done before the focus event.
	 * @param {FocusEvent} evt
	 */
	const onFocus = evt => {
		const target = evt.target;
		if (
			target instanceof HTMLInputElement &&
			!nonTextInputTypes.has(target.type)
		) {
			target.style.transform = 'translateY(-2000px)';
			window.requestAnimationFrame(() => {
				target.style.transform = '';

				// NOTE(joel): This will have prevented the browser from scrolling the
				// focused element into view, so we need to do this ourselves in a way
				// that doesn't cause the whole page to scroll.
				if (visualViewport) {
					if (visualViewport.height < window.innerHeight) {
						// NOTE(joel): If the keyboard is already visible, do this after
						// one additional frame to wait for the transform to be removed...
						window.requestAnimationFrame(() => {
							scrollIntoView(target);
						});
					} else {
						// ... otherwise, wait for the visual viewport to resize before
						// scrolling so we can measure the correct position to scroll to.
						visualViewport.addEventListener(
							'resize',
							() => scrollIntoView(target),
							{ once: true },
						);
					}
				}
			});
		}
	};

	// NOTE(joel): If the window scrolled, scroll it back to the top.
	// It should always be at the top because the body will have a negative
	// margin (see next block).
	const onWindowScroll = () => {
		window.scrollTo(0, 0);
	};

	// NOTE(joel): Record the original scroll position so we can restore it.
	// Then apply a negative margin to the body to offset it by the scroll
	// position. This will enable us to scroll the window to the top, which is
	// required for the rest of this to work.
	const scrollX = window.pageXOffset;
	const scrollY = window.pageYOffset;
	const restoreStyles = chain(
		setStyle(
			document.documentElement,
			'paddingRight',
			`${window.innerWidth - document.documentElement.clientWidth}px`,
		),
		setStyle(document.documentElement, 'overflow', 'hidden'),
		setStyle(document.body, 'marginTop', `-${scrollY}px`),
	);

	// NOTE(joel): Scroll to the top. The negative margin on the body will make
	// this appear the same.
	window.scrollTo(0, 0);

	const removeEvents = chain(
		addEvent(document, 'touchstart', onTouchStart, {
			passive: false,
			capture: true,
		}),
		addEvent(document, 'touchmove', onTouchMove, {
			passive: false,
			capture: true,
		}),
		addEvent(document, 'touchend', onTouchEnd, {
			passive: false,
			capture: true,
		}),
		addEvent(document, 'focus', onFocus, true),
		addEvent(window, 'scroll', onWindowScroll),
	);

	return () => {
		// Restore styles and scroll the page back to where it was.
		restoreStyles();
		removeEvents();
		window.scrollTo(scrollX, scrollY);
	};
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Sets a CSS property on an element, and returns a function to revert it to
 * the previous value.
 * @param {HTMLElement} element
 * @param {string} style
 * @param {string} value
 * @returns {() => void}
 */
function setStyle(element, style, value) {
	const cur = element.style[style];
	element.style[style] = value;
	return () => {
		element.style[style] = cur;
	};
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Adds an event listener to an element, and returns a function to remove it.
 * @param {EventTarget} target
 * @param {T} event
 * @param {(this: Document, ev: GlobalEventHandlersEventMap[T]) => any} handler
 * @param {boolean | AddEventListenerOptions} [options]
 * @returns {() => void}
 * @template T
 */
function addEvent(target, event, handler, options) {
	target.addEventListener(event, handler, options);
	return () => {
		target.removeEventListener(event, handler, options);
	};
}

////////////////////////////////////////////////////////////////////////////////

/**
 * scrollIntoView finds the parent scrollable element and adjust the scroll
 * position if the target is not already in view.
 * @param {Element} target
 */
function scrollIntoView(target) {
	const scrollable = getScrollParent(target);
	if (scrollable !== document.documentElement && scrollable !== document.body) {
		let scrollableTop = scrollable.getBoundingClientRect().top;
		let targetTop = target.getBoundingClientRect().top;
		if (targetTop > scrollableTop + target.clientHeight) {
			scrollable.scrollTop += targetTop - scrollableTop;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * getScrollParent traverses up the DOM hierachy and returns the first element
 * that is scrollable.
 * @param {Element} node
 * @returns {Element}
 */
function getScrollParent(node) {
	while (node && !isScrollable(node)) {
		node = node.parentElement;
	}
	return node || document.scrollingElement || document.documentElement;
}

/**
 * isScrollable tests if a given Element is scrollable.
 * @param {Element} node
 * @returns {boolean}
 */
function isScrollable(node) {
	const style = window.getComputedStyle(node);
	return /(auto|scroll)/.test(
		style.overflow + style.overflowX + style.overflowY,
	);
}
