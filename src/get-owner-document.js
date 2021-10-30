import { canUseDOM } from './can-use-dom';

/**
 * getOwnerDocument returns the `element`s owner document.
 * Useful when components are used in iframes or other environments.
 * @param {T} [element]
 * @returns {Document | null}
 * @template {Element} T
 */
export function getOwnerDocument(element) {
	return canUseDOM() ? (element ? element.ownerDocument : document) : null;
}
