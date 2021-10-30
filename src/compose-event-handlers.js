/**
 * @typedef {React.SyntheticEvent | Event} EventType
 */

/**
 * Wraps a lib-defined event handler and a user-defined event handler, returning
 * a single handler that allows a user to prevent lib-defined handlers from
 * firing.
 * @param {((event: EventType) => any) | undefined} theirHandler
 * @param {(event: EventType) => any} ourHandler
 * @returns {(event: EventType) => any}
 */
export function composeEventHandlers(theirHandler, ourHandler) {
	return event => {
		theirHandler && theirHandler(event);
		if (!event.defaultPrevented) {
			return ourHandler(event);
		}
	};
}
