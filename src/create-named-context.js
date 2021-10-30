import { createContext } from 'react';

/**
 * createNamedContext creates a React context with a `displayName` property
 * if run in development.
 * @param {string} name
 * @param {T} defaultValue
 * @returns {React.Context<T>}
 * @template T
 */
export function createNamedContext(name, defaultValue) {
	const Context = createContext(defaultValue);
	Context.displayName = name;
	return Context;
}
