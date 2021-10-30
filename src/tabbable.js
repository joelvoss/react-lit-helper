/**
 * @typedef {(
 *   element: HTMLElement,
 *   index: number,
 *   array: Array<T>
 * ) => void} FilterFunc
 * @template T
 */

////////////////////////////////////////////////////////////////////////////////

const candidateSelectors = [
	'input',
	'select',
	'textarea',
	'a[href]',
	'button',
	'[tabindex]',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'details>summary:first-of-type',
	'details',
];

const candidateSelector = candidateSelectors.join(',');
const focusableCandidateSelector = candidateSelectors
	.concat('iframe')
	.join(',');

////////////////////////////////////////////////////////////////////////////////

const matches =
	typeof Element === 'undefined'
		? function () {}
		: Element.prototype.matches ||
		  Element.prototype.msMatchesSelector ||
		  Element.prototype.webkitMatchesSelector;

/**
 * getCandidates
 * @param {HTMLElement} el
 * @param {boolean} includeContainer
 * @param {FilterFunc<T>} filter
 * @returns {Array<string>}
 * @template T
 */
function getCandidates(el, includeContainer, filter) {
	let candidates = Array.prototype.slice.apply(
		el.querySelectorAll(candidateSelector),
	);
	if (includeContainer && matches.call(el, candidateSelector)) {
		candidates.unshift(el);
	}
	candidates = candidates.filter(filter);
	return candidates;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isContentEditable tests if a given node is `contentEditable`.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isContentEditable(node) {
	return node.contentEditable === 'true';
}

/**
 * getTabindex returns the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number}
 */
function getTabindex(node) {
	const tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);

	if (!isNaN(tabindexAttr)) {
		return tabindexAttr;
	}

	// NOTE(joel): Browsers do not return `tabIndex` correctly for
	// contentEditable nodes.
	if (isContentEditable(node)) {
		return 0;
	}

	// NOTE(joel): In Chrome, <details/>, <audio controls/> and <video controls/>
	// elements get a default `tabIndex` of -1 when the 'tabindex' attribute
	// isn't specified in the DOM, yet they are still part of the regular tab
	// order.
	// In FF, they get a default `tabIndex` of 0. Since Chrome still puts
	// those elements in the regular tab order, consider their tab index to be 0.
	if (
		(node.nodeName === 'AUDIO' ||
			node.nodeName === 'VIDEO' ||
			node.nodeName === 'DETAILS') &&
		node.getAttribute('tabindex') === null
	) {
		return 0;
	}

	return node.tabIndex;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * sortOrderedTabbables is the sort implementation to order tabbables.
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @returns {boolean}
 */
function sortOrderedTabbables(a, b) {
	return a.tabIndex === b.tabIndex
		? a.documentOrder - b.documentOrder
		: a.tabIndex - b.tabIndex;
}

/**
 * isInput tests if a given node is an input element.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isInput(node) {
	return node.tagName === 'INPUT';
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isHiddenInput tests if a given node is a hidden element.
 * @param {HTMLInputElement} node
 * @returns {boolean}
 */
function isHiddenInput(node) {
	return isInput(node) && node.type === 'hidden';
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isHiddenInput tests if a given node is a hidden element.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isDetailsWithSummary(node) {
	const isDetails = node.tagName === 'DETAILS';
	const hasSummary = Array.prototype.slice
		.apply(node.children)
		.some(child => child.tagName === 'SUMMARY');
	return isDetails && hasSummary;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * getCheckedRadio returns the checked input element from a list of elements.
 * @param {Array<HTMLInputElement>} nodes
 * @param {HTMLFormElement} form
 * @returns {HTMLInputElement}
 */
function getCheckedRadio(nodes, form) {
	for (let i = 0; i < nodes.length; i++) {
		/** @type {HTMLInputElement} */
		const node = nodes[i];
		if (node.checked && node.form === form) {
			return node;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isTabbableRadio tests if given node if a tabbale radio element.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isTabbableRadio(node) {
	if (!node.name) {
		return true;
	}
	const radioScope = node.form || node.ownerDocument;

	const queryRadios = name =>
		radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');

	let radioSet;
	if (
		typeof window !== 'undefined' &&
		typeof window.CSS !== 'undefined' &&
		typeof window.CSS.escape === 'function'
	) {
		radioSet = queryRadios(window.CSS.escape(node.name));
	} else {
		try {
			radioSet = queryRadios(node.name);
		} catch (err) {
			console.error(
				`Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: ${err.message}`,
			);
			return false;
		}
	}

	const checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isRadio tests if a given node is a radio element.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isRadio(node) {
	return isInput(node) && node.type === 'radio';
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isNonTabbableRadio tests if a given node is radio element and not tabbale.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isNonTabbableRadio(node) {
	return isRadio(node) && !isTabbableRadio(node);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isHidden tests if a given node is visually hidden.
 * @param {HTMLElement} node
 * @param {boolean} displayCheck
 * @returns {boolean}
 */
function isHidden(node, displayCheck) {
	if (getComputedStyle(node).visibility === 'hidden') {
		return true;
	}

	const isDirectSummary = matches.call(node, 'details>summary:first-of-type');
	const nodeUnderDetails = isDirectSummary ? node.parentElement : node;
	if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
		return true;
	}
	if (!displayCheck || displayCheck === 'full') {
		while (node) {
			if (getComputedStyle(node).display === 'none') {
				return true;
			}
			node = node.parentElement;
		}
	} else if (displayCheck === 'non-zero-area') {
		const { width, height } = node.getBoundingClientRect();
		return width === 0 && height === 0;
	}

	return false;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isDisabledFromFieldset tests if a given node is a disbaled form fieldset.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isDisabledFromFieldset(node) {
	if (
		isInput(node) ||
		node.tagName === 'SELECT' ||
		node.tagName === 'TEXTAREA' ||
		node.tagName === 'BUTTON'
	) {
		let parentNode = node.parentElement;
		while (parentNode) {
			if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
				// NOTE(joel): Form fields (nested) inside a disabled fieldset are not
				// focusable/tabbable unless they are in the _first_ <legend> element
				// of the top-most disabled fieldset.
				for (let i = 0; i < parentNode.children.length; i++) {
					const child = parentNode.children.item(i);
					if (child.tagName === 'LEGEND') {
						if (child.contains(node)) {
							return false;
						}

						// NOTE(joel): The node isn't in the first legend (in doc order),
						// so no matter where it is now, it'll be disabled.
						return true;
					}
				}

				// NOTE(joel): The node isn't in a legend, so no matter where it is
				// now, it'll be disabled
				return true;
			}

			parentNode = parentNode.parentElement;
		}
	}

	return false;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isNodeMatchingSelectorFocusable tests if a optional given node matches a
 * focusable selector.
 * @param {{ displayCheck: boolean }} options
 * @param {HTMLElement} node
 * @returns
 */
function isNodeMatchingSelectorFocusable(options, node) {
	if (
		node.disabled ||
		isHiddenInput(node) ||
		isHidden(node, options.displayCheck) ||
		// NOTE(joel): For a details element with a summary, the summary element
		// gets the focus
		isDetailsWithSummary(node) ||
		isDisabledFromFieldset(node)
	) {
		return false;
	}
	return true;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * isNodeMatchingSelectorFocusable tests if a optional given node matches a
 * tabbable selector.
 * @param {{ displayCheck: boolean }} options
 * @param {HTMLElement} node
 * @returns
 */
function isNodeMatchingSelectorTabbable(options, node) {
	if (node == null) return false;
	if (
		!isNodeMatchingSelectorFocusable(options, node) ||
		isNonTabbableRadio(node) ||
		getTabindex(node) < 0
	) {
		return false;
	}
	return true;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * tabbable
 * @param {HTMLElement} el
 * @param {} options
 * @returns {Array<string>}
 */
export function tabbable(el, options) {
	options = options || {};

	const regularTabbables = [];
	const orderedTabbables = [];

	const candidates = getCandidates(
		el,
		options.includeContainer,
		isNodeMatchingSelectorTabbable.bind(null, options),
	);

	candidates.forEach((candidate, i) => {
		const candidateTabindex = getTabindex(candidate);
		if (candidateTabindex === 0) {
			regularTabbables.push(candidate);
		} else {
			orderedTabbables.push({
				documentOrder: i,
				tabIndex: candidateTabindex,
				node: candidate,
			});
		}
	});

	const tabbableNodes = orderedTabbables
		.sort(sortOrderedTabbables)
		.map(a => a.node)
		.concat(regularTabbables);

	return tabbableNodes;
}

////////////////////////////////////////////////////////////////////////////////

export function focusable(el, options) {
	options = options || {};

	const candidates = getCandidates(
		el,
		options.includeContainer,
		isNodeMatchingSelectorFocusable.bind(null, options),
	);

	return candidates;
}

////////////////////////////////////////////////////////////////////////////////

export function isTabbable(node, options) {
	options = options || {};
	if (!node) {
		throw new Error('No node provided');
	}
	if (matches.call(node, candidateSelector) === false) {
		return false;
	}
	return isNodeMatchingSelectorTabbable(options, node);
}

////////////////////////////////////////////////////////////////////////////////
/**
 * isFocusable
 * @param {HTMLElement} node
 * @param {{}} options
 * @returns  {boolean}
 */
export function isFocusable(node, options) {
	options = options || {};
	if (!node) {
		throw new Error('No node provided');
	}
	if (matches.call(node, focusableCandidateSelector) === false) {
		return false;
	}
	return isNodeMatchingSelectorFocusable(options, node);
}
