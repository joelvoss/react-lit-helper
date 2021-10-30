import * as React from 'react';
import { render } from '../test-utils';
import { useForceUpdate } from '../../src/use-force-update';

describe(`useForceUpdate`, () => {
	it(`should force a re-render`, async () => {
		const Component = () => {
			const forceUpdate = useForceUpdate();

			const updateCount = React.useRef(0);
			React.useEffect(() => {
				forceUpdate();
			}, [forceUpdate]);

			React.useEffect(() => {
				updateCount.current++;
			});

			return <div>Update count: {updateCount.current}</div>;
		};

		const { findByText } = render(<Component />);

		const element = await findByText(/update count/i);
		expect(element.innerHTML).toBe('Update count: 1');
	});
});
