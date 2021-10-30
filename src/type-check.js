/**
 * isBoolean checks whether or not a value is a boolean.
 * @param {T} value
 * @returns {T is boolean}
 * @template T
 */
export function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * isFunction checks whether or not a value is a function.
 * @param {T} value
 * @returns {T is Function}
 * @template T
 */
export function isFunction(value) {
	// eslint-disable-next-line eqeqeq
	return !!(value && {}.toString.call(value) == '[object Function]');
}

/**
 * isNumber checks whether or not a value is a number.
 * @param {T} value
 * @returns {T is number}
 * @template T
 */
export function isNumber(value) {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * isString checks whether or not a value is a string.
 * @param {T} value
 * @returns {T is string}
 * @template T
 */
export function isString(value) {
	return typeof value === 'string';
}
