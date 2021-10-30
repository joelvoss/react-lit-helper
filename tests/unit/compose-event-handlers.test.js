import { composeEventHandlers } from '../../src/compose-event-handlers';

describe(`compose-event-handlers`, () => {
	const event = new MouseEvent('click', {
		view: window,
		bubbles: true,
		cancelable: true,
	});

	const externalListener = jest.fn();
	function externalHandler() {
		externalListener();
	}

	const internalListener = jest.fn();
	function internalHandler() {
		internalListener();
	}

	function externalPreventDefaulted(event) {
		event.preventDefault();
		externalListener();
	}

	let elem;
	beforeEach(() => {
		elem = document.createElement('button');
	});

	afterEach(() => {
		externalListener.mockReset();
		internalListener.mockReset();
		elem.parentElement?.removeChild(elem);
	});

	it('calls both handlers handler', () => {
		const composed = composeEventHandlers(externalHandler, internalHandler);
		elem.addEventListener('click', composed);
		elem.dispatchEvent(event);
		expect(externalListener).toHaveBeenCalledTimes(1);
		expect(internalListener).toHaveBeenCalledTimes(1);
		elem.removeEventListener('click', composed);
	});

	it('does not call handler that got prevented', () => {
		const composed = composeEventHandlers(
			externalPreventDefaulted,
			internalHandler,
		);
		elem.addEventListener('click', composed);
		elem.dispatchEvent(event);
		expect(externalListener).toHaveBeenCalledTimes(1);
		expect(internalListener).toHaveBeenCalledTimes(0);
		elem.removeEventListener('click', composed);
	});
});
