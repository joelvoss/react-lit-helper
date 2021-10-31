/**
 * isRightClick
 * @param {MouseEvent | PointerEvent | TouchEvent} nativeEvent
 * @returns {boolean}
 */
export function isRightClick(nativeEvent) {
	return 'which' in nativeEvent
		? nativeEvent.which === 3
		: 'button' in nativeEvent
		? nativeEvent.button === 2
		: false;
}
