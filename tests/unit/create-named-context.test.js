import * as React from 'react';
import { createNamedContext } from '../../src/create-named-context';

describe(`createNamedContext`, () => {
	it(`should create a named React context`, () => {
		const ControlCtx = React.createContext();
		const Ctx = createNamedContext('context-name');

		expect(Ctx.$$typeof).toBe(ControlCtx.$$typeof);
		expect(Ctx.Provider.$$typeof).toBe(ControlCtx.Provider.$$typeof);
		expect(Ctx.Consumer.$$typeof).toBe(ControlCtx.Consumer.$$typeof);
		expect(Ctx.displayName).toBe('context-name');
	})
});
