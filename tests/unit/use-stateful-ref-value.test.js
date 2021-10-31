import * as React from 'react';
import { render } from '../test-utils';
import { useStatefulRefValue } from '../../src/use-stateful-ref-value';

describe(`useStatefulRefValue`, () => {
	it(`should store the element as ref and force a re-render`, async () => {
		const Component = () => {
			let ref = React.useRef(null);
			let [element, handleRefSet] = useStatefulRefValue(ref, null);

			const updateCount = React.useRef(0);
			React.useEffect(() => {
				updateCount.current++;
			});

			return (
				<>
					<div ref={handleRefSet}>Update count: {updateCount.current}</div>
					<div>Element: {element?.toString()}</div>
				</>
			);
		};

		const { findByText } = render(<Component />);

		const updateElem = await findByText(/update count/i);
		expect(updateElem.innerHTML).toBe('Update count: 1');

		const element = await findByText(/element/i);
		expect(element.innerHTML).toBe('Element: [object HTMLDivElement]');
	});
});
