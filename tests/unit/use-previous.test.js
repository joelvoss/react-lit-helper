import * as React from 'react';
import { render, userEvent } from '../test-utils';
import { usePrevious } from '../../src/use-previous';

describe(`usePrevious`, () => {
	it(`should return the previous render value`, async () => {
		const Comp = () => {
			const [count, setCount] = React.useState(0);
			const prevCount = usePrevious(count);

			return (
				<div>
					<button data-testid="button" onClick={() => setCount(s => ++s)}>
						+1
					</button>
					<p data-testid="count">{count}</p>
					<p data-testid="prevCount">{prevCount}</p>
				</div>
			);
		};

		const { getByTestId } = render(<Comp />);

		const button = getByTestId('button');
		const count = getByTestId('count');
		const prevCount = getByTestId('prevCount');

		expect(count.innerHTML).toBe('0');
		expect(prevCount.innerHTML).toBe('');

		userEvent.click(button);

		expect(count.innerHTML).toBe('1');
		expect(prevCount.innerHTML).toBe('0');

		userEvent.click(button);

		expect(count.innerHTML).toBe('2');
		expect(prevCount.innerHTML).toBe('1');
	});
});
