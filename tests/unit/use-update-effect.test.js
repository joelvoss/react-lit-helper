import * as React from 'react';
import { render, userEvent } from '../test-utils';
import { useUpdateEffect } from '../../src/use-update-effect';

describe(`useUpdateEffect`, () => {
	it(`should skip initial render`, async () => {

		const updateCall = jest.fn();
		const effectCall = jest.fn();

		const Component = () => {
			useUpdateEffect(() => {
				updateCall();
			}, [])
			
			React.useEffect(() => {
				effectCall();
			}, [])

			return <div></div>;
		};

		render(<Component />);

		expect(updateCall).not.toBeCalled();
		expect(effectCall).toBeCalledTimes(1);
	});
	
	it(`should skip initial render but update on changes after mount`, async () => {
		const updateCall = jest.fn();
		const effectCall = jest.fn();

		const Component = () => {
			const [update, updateSet] = React.useState(0);

			useUpdateEffect(() => {
				updateCall();
			}, [update])
			
			React.useEffect(() => {
				effectCall();
			}, [update])

			return <button onClick={() => updateSet(1)}>Update</button>;
		};

		const { getByRole } = render(<Component />);

		expect(updateCall).not.toBeCalled();
		expect(effectCall).toBeCalledTimes(1);

		const button = getByRole('button');
		await userEvent.click(button);

		expect(updateCall).toBeCalledTimes(1);
		expect(effectCall).toBeCalledTimes(2);
	});
});
