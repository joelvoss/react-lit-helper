import { isBoolean, isFunction, isNumber, isString } from '../../src/type-check';

describe(`type-check`, () => {
	describe(`isBoolean`, () => {
		it(`should check wether a value is of type "boolean"`, () => {
			expect(isBoolean(1 === 1)).toBe(true);
			expect(isBoolean(1 == 2)).toBe(true);
			expect(isBoolean(1 != null)).toBe(true);
			expect(isBoolean('0')).toBe(false);
			expect(isBoolean(0)).toBe(false);
			expect(isBoolean(null)).toBe(false);
			expect(isBoolean(undefined)).toBe(false);
		});
	});
	describe(`isFunction`, () => {
		it(`should check wether a value is of type "Function"`, () => {
			expect(isFunction(() => {})).toBe(true);
			expect(isFunction('string')).toBe(false);
			expect(isFunction('0')).toBe(false);
			expect(isFunction(0)).toBe(false);
			expect(isFunction(null)).toBe(false);
			expect(isFunction(undefined)).toBe(false);
		});
	});
	describe(`isNumber`, () => {
		it(`should check wether a value is of type "number"`, () => {
			expect(isNumber(10)).toBe(true);
			expect(isNumber('0')).toBe(false);
			expect(isNumber(0)).toBe(true);
			expect(isNumber(null)).toBe(false);
			expect(isNumber(undefined)).toBe(false);
		});
	});
	describe(`isString`, () => {
		it(`should check wether a value is of type "string"`, () => {
			expect(isString('string')).toBe(true);
			expect(isString('0')).toBe(true);
			expect(isString(0)).toBe(false);
			expect(isString(null)).toBe(false);
			expect(isString(undefined)).toBe(false);
		});
	});
});
