import { getOwnerDocument } from './get-owner-document';

/**
 * getDocumentDimensions returns the size of the working document minus the
 * scrollbar offset.
 * @param {HTMLElement} [element]
 */
export function getDocumentDimensions(element) {
	const ownerDocument = getOwnerDocument(element);
	const ownerWindow = ownerDocument?.defaultView || window;

	if (!ownerDocument) return { width: 0, height: 0 };

	return {
		width: ownerDocument.documentElement.clientWidth ?? ownerWindow.innerWidth,
		height:
			ownerDocument.documentElement.clientHeight ?? ownerWindow.innerHeight,
	};
}
