import * as React from 'react';
import { render, userEvent } from '../test-utils';
import { useStableCallback } from '../../src/use-stable-callback';

describe(`useStableCallback`, () => {
	it(`should convert an unstable into a stable callback`, async () => {
		const alert = jest.fn();

		const InnerComp = ({ name, cb }) => {
			const updateCount = React.useRef(0);
			React.useEffect(() => {
				updateCount.current++;
			}, [cb]);

			return (
				<>
					<div>
						{name} count: {updateCount.current}
					</div>
					<button onClick={cb}>{name} trigger</button>
				</>
			);
		};

		const Component = () => {
			const [text, updateText] = React.useState('');

			const stableCb = useStableCallback(() => {
				alert(text);
			});

			const unstableCb = React.useCallback(() => {
				alert(text);
			});

			const updateCount = React.useRef(0);
			React.useEffect(() => {
				updateCount.current++;
			});

			return (
				<>
					<input
						type="text"
						value={text}
						onChange={e => updateText(e.target.value)}
					/>
					<div>reference count: {updateCount.current}</div>
					<InnerComp name="stable" cb={stableCb} />
					<InnerComp name="unstable" cb={unstableCb} />
				</>
			);
		};

		const { getByRole, findByText, getByText } = render(<Component />);

		const inputText = 'test';
		userEvent.type(getByRole('textbox'), inputText);

		const outerEl = await findByText(/^reference count/i);
		expect(outerEl.innerHTML).toBe(`reference count: ${inputText.length}`);

		const stableEl = await findByText(/^stable count/i);
		expect(stableEl.innerHTML).toBe('stable count: 1');

		const unstableEl = await findByText(/^unstable count/i);
		expect(unstableEl.innerHTML).toBe(`unstable count: ${inputText.length}`);

		userEvent.click(getByText(/^stable trigger/i));
		expect(alert).toBeCalledTimes(1);
		expect(alert).toBeCalledWith(inputText);

		userEvent.click(getByText(/^unstable trigger/i));
		expect(alert).toBeCalledTimes(2);
		expect(alert).toBeCalledWith(inputText);
	});
});
