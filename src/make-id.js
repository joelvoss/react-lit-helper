/**
 * makeId joins `args` to form a generic ID. *
 * @param {Array<string | number>} [args]
 * @returns {string}
 */
export function makeId(...args) {
	return args.filter(val => val != null).join('--');
}
