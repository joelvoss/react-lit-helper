import * as React from 'react';
import { render } from '../test-utils';
import { useComposeRefs } from '../../src/use-compose-refs';

describe(`useComposeRefs`, () => {
	it(`should compose two refs`, async () => {
		let innerRef, outerRef;

		const InnerComp = React.forwardRef((_, parentRef) => {
			innerRef = React.useRef();
			const ref = useComposeRefs(innerRef, parentRef);
			return <div ref={ref}>InnerComp</div>;
		});

		const OuterComp = () => {
			outerRef = React.useRef();
			return (
				<div>
					OuterComp
					<InnerComp ref={outerRef} />
				</div>
			);
		};

		render(<OuterComp />);

		expect(innerRef.current.innerHTML).toEqual('InnerComp');
		expect(innerRef.current.innerHTML).toEqual(outerRef.current.innerHTML);
	});
});
