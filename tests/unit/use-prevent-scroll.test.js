import * as React from 'react';
import { render, userEvent } from '../test-utils';
import { usePreventScroll } from '../../src/use-prevent-scroll';

describe(`usePreventScroll`, () => {
	it(`should set proper styles on the documentElement (<body>)`, async () => {
		const Modal = () => {
			usePreventScroll();
			return <div>Modal</div>;
		};

		const Parent = () => {
			const [visible, setVisible] = React.useState(false);
			const toggle = () => setVisible(s => !s);
			return (
				<div>
					<button onClick={toggle}>Trigger</button>
					{visible ? <Modal /> : null}
				</div>
			);
		};

		// jsdom default window dimensions: 1024x768
		const resetDimensions = setDocumentDimensions(1009, 768);

		const { getByText } = render(<Parent />);

		expect(document.documentElement.style.paddingRight).toBe('');
		expect(document.documentElement.style.overflow).toBe('');

		await userEvent.click(getByText(/Trigger/i))

		expect(document.documentElement.style.paddingRight).toBe('15px');
		expect(document.documentElement.style.overflow).toBe('hidden');

		resetDimensions();
	});
});

////////////////////////////////////////////////////////////////////////////////

/**
 * setDocumentDimensions sets current document clientWidth/clientHeight values
 * and returns a reset function.
 * @param {number|null} w
 * @param {number|null} h
 * @returns {() => void}
 */
function setDocumentDimensions(w, h) {
	Object.defineProperty(document.documentElement, 'clientWidth', {
		writable: true,
		configurable: true,
		value: w,
	});
	Object.defineProperty(document.documentElement, 'clientHeight', {
		writable: true,
		configurable: true,
		value: h,
	});

	// Reset
	return () => {
		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			configurable: true,
			value: 0,
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			writable: true,
			configurable: true,
			value: 0,
		});
	};
}
