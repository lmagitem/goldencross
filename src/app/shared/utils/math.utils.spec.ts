import { MathUtils } from './math.utils';

describe('MathUtils', () => {
  it(`.isNumeric should return true when given a number`, () => {
    expect(MathUtils.isNumeric(1)).toBe(true);
    expect(MathUtils.isNumeric(0)).toBe(true);
    expect(MathUtils.isNumeric(-1)).toBe(true);
    expect(MathUtils.isNumeric(3132453953904395830403349341)).toBe(true);
    expect(MathUtils.isNumeric(1.32535)).toBe(true);
    expect(MathUtils.isNumeric(234225.4354423231)).toBe(true);
    expect(MathUtils.isNumeric(-23435334335541)).toBe(true);
  });
  it(`.isNumeric should return true when given a string with a properly formatted number`, () => {
    expect(MathUtils.isNumeric('1')).toBe(true);
    expect(MathUtils.isNumeric('0')).toBe(true);
    expect(MathUtils.isNumeric('-1234')).toBe(true);
    expect(MathUtils.isNumeric('322384294053053834840304323')).toBe(true);
    expect(MathUtils.isNumeric('14322323.4233')).toBe(true);
    expect(MathUtils.isNumeric('145 265 953')).toBe(true);
    expect(MathUtils.isNumeric('145 265.000')).toBe(true);
  });
  it(`.isNumeric sould return false when given a badly formatted number`, () => {
    expect(MathUtils.isNumeric('14322323,4233')).toBe(false);
    expect(MathUtils.isNumeric('145265€')).toBe(false);
    expect(MathUtils.isNumeric('1,265,481.95')).toBe(false);
  });
  it(`.isNumeric should return false when given something that's not a number`, () => {
    expect(MathUtils.isNumeric(undefined)).toBe(false);
    expect(MathUtils.isNumeric(null)).toBe(false);
    expect(MathUtils.isNumeric(false)).toBe(false);
    expect(MathUtils.isNumeric('house')).toBe(false);
    expect(MathUtils.isNumeric('')).toBe(false);
    expect(MathUtils.isNumeric({ n: 3 })).toBe(false);
    expect(MathUtils.isNumeric({})).toBe(false);
    expect(MathUtils.isNumeric([])).toBe(false);
    expect(MathUtils.isNumeric([433, 454, 123])).toBe(false);
    expect(MathUtils.isNumeric(() => 3)).toBe(false);
  });

  it(`.isInteger should return true when given an integer`, () => {
    expect(MathUtils.isInteger(1)).toBe(true);
    expect(MathUtils.isInteger(0)).toBe(true);
    expect(MathUtils.isInteger(-1)).toBe(true);
    expect(MathUtils.isInteger(3132453953904395830403349341)).toBe(true);
    expect(MathUtils.isInteger(-23435334335541)).toBe(true);
  });
  it(`.isInteger should return true when given a string with a properly formatted integer`, () => {
    expect(MathUtils.isInteger('1')).toBe(true);
    expect(MathUtils.isInteger('0')).toBe(true);
    expect(MathUtils.isInteger('-1234')).toBe(true);
    expect(MathUtils.isInteger('322384294053053834840304323')).toBe(true);
    expect(MathUtils.isInteger('145 265 953')).toBe(true);
    expect(MathUtils.isInteger('145 265.000')).toBe(true);
  });
  it(`.isInteger sould return false when given a float`, () => {
    expect(MathUtils.isInteger(1.32535)).toBe(false);
    expect(MathUtils.isInteger(234225.4354423231)).toBe(false);
    expect(MathUtils.isInteger('14322323.4233')).toBe(false);
  });
  it(`.isInteger sould return false when given a badly formatted number`, () => {
    expect(MathUtils.isInteger('14322323,4233')).toBe(false);
    expect(MathUtils.isInteger('145265€')).toBe(false);
    expect(MathUtils.isInteger('1,265,481.95')).toBe(false);
  });

  it(`.isNumericBeingTyped should return true when given an integer or a float`, () => {
    expect(MathUtils.isNumeric(1)).toBe(true);
    expect(MathUtils.isNumeric(0)).toBe(true);
    expect(MathUtils.isNumeric(-1)).toBe(true);
    expect(MathUtils.isNumeric(3132453953904395830403349341)).toBe(true);
    expect(MathUtils.isNumeric(1.32535)).toBe(true);
    expect(MathUtils.isNumeric(234225.4354423231)).toBe(true);
    expect(MathUtils.isNumeric(-23435334335541)).toBe(true);
    expect(MathUtils.isNumeric('1')).toBe(true);
    expect(MathUtils.isNumeric('0')).toBe(true);
    expect(MathUtils.isNumeric('-1234')).toBe(true);
    expect(MathUtils.isNumeric('322384294053053834840304323')).toBe(true);
    expect(MathUtils.isNumeric('14322323.4233')).toBe(true);
    expect(MathUtils.isNumeric('145 265 953')).toBe(true);
    expect(MathUtils.isNumeric('145 265.000')).toBe(true);
  });
  it(`.isNumericBeingTyped should return true when given a float being written`, () => {
    expect(MathUtils.isInteger('1.')).toBe(true);
    expect(MathUtils.isInteger('0.')).toBe(true);
    expect(MathUtils.isInteger('-1234.')).toBe(true);
    expect(MathUtils.isInteger('32238429405305383.')).toBe(true);
    expect(MathUtils.isInteger('145 265 953.')).toBe(true);
    expect(MathUtils.isInteger('145 265.')).toBe(true);
  });
  it(`.isNumericBeingTyped sould return false when given something else`, () => {
    expect(MathUtils.isInteger('14322323,4233')).toBe(false);
    expect(MathUtils.isInteger('145265€')).toBe(false);
    expect(MathUtils.isInteger('14.185.')).toBe(false);
    expect(MathUtils.isInteger('14.185.1')).toBe(false);
    expect(MathUtils.isInteger('1,265,481.95')).toBe(false);
    expect(MathUtils.isNumeric(undefined)).toBe(false);
    expect(MathUtils.isNumeric(null)).toBe(false);
    expect(MathUtils.isNumeric(false)).toBe(false);
    expect(MathUtils.isNumeric('house')).toBe(false);
    expect(MathUtils.isNumeric('')).toBe(false);
    expect(MathUtils.isNumeric({ n: 3 })).toBe(false);
    expect(MathUtils.isNumeric({})).toBe(false);
    expect(MathUtils.isNumeric([])).toBe(false);
    expect(MathUtils.isNumeric([433, 454, 123])).toBe(false);
    expect(MathUtils.isNumeric(() => 3)).toBe(false);
  });

  it(`.isNumericAcceptFrenchLocale should return true when given a number`, () => {
    expect(MathUtils.isNumericAcceptFrenchLocale(1)).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale(0)).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale(-1)).toBe(true);
    expect(
      MathUtils.isNumericAcceptFrenchLocale(3132453953904395830403349341)
    ).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale(1.32535)).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale(234225.4354423231)).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale(-23435334335541)).toBe(true);
  });
  it(`.isNumericAcceptFrenchLocale should return true when given a string with a properly formatted number`, () => {
    expect(MathUtils.isNumericAcceptFrenchLocale('1')).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('0')).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('-1234')).toBe(true);
    expect(
      MathUtils.isNumericAcceptFrenchLocale('322384294053053834840304323')
    ).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('14322323.4233')).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('14322323,4233')).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('145 265 953')).toBe(true);
    expect(MathUtils.isNumericAcceptFrenchLocale('145 265.000')).toBe(true);
  });
  it(`.isNumericAcceptFrenchLocale sould return false when given a badly formatted number`, () => {
    expect(MathUtils.isNumericAcceptFrenchLocale('145265€')).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale('1,265,481.95')).toBe(false);
  });
  it(`.isNumericAcceptFrenchLocale should return false when given something that's not a number`, () => {
    expect(MathUtils.isNumericAcceptFrenchLocale(undefined)).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale(null)).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale(false)).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale('house')).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale('')).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale({ nombre: 3 })).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale({})).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale([])).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale([433, 454, 123])).toBe(false);
    expect(MathUtils.isNumericAcceptFrenchLocale(() => 3)).toBe(false);
  });
  it(`.evaluateOrZero should return 0 when given anything else than a proper formula`, () => {
    expect(MathUtils.evaluateOrZero(undefined!)).toEqual(0);
    expect(MathUtils.evaluateOrZero(null!)).toEqual(0);
    expect(MathUtils.evaluateOrZero('null')).toEqual(0);
    expect(MathUtils.evaluateOrZero('true')).toEqual(0);
    expect(MathUtils.evaluateOrZero('false')).toEqual(0);
    expect(MathUtils.evaluateOrZero('')).toEqual(0);
    expect(MathUtils.evaluateOrZero('1/0')).toEqual(0);
    expect(MathUtils.evaluateOrZero('a * b')).toEqual(0);
  });
  it(`.evaluateOrZero should return the result of a properly formatted formula`, () => {
    expect(MathUtils.evaluateOrZero('1+1')).toEqual(2);
    expect(MathUtils.evaluateOrZero('0+0')).toEqual(0);
    expect(MathUtils.evaluateOrZero('2 +8')).toEqual(10);
    expect(MathUtils.evaluateOrZero('2 * 3')).toEqual(6);
    expect(MathUtils.evaluateOrZero('2 * 1.5')).toEqual(3);
    expect(MathUtils.evaluateOrZero('1 * (2 + 3)')).toEqual(5);
    expect(MathUtils.evaluateOrZero('-5 -10')).toEqual(-15);
    expect(MathUtils.evaluateOrZero('5^ 2')).toEqual(25);
    expect(MathUtils.evaluateOrZero('sqrt(3^2 + 4^2)')).toEqual(5);
    expect(MathUtils.evaluateOrZero('cos(45 deg)')).toEqual(0.7071067811865476);
  });

  it(`.returnPercentage should return a percentage corresponding to the inputs`, () => {
    expect(MathUtils.returnPercentage(25, 50)).toEqual(50);
    expect(MathUtils.returnPercentage(25, 50, '1')).toEqual(0.5);
    expect(MathUtils.returnPercentage(3, 5)).toEqual(60);
    expect(MathUtils.returnPercentage(3, 5, '1')).toEqual(0.6);
    expect(MathUtils.returnPercentage(1, 3)).toEqual(33.333333333333336);
    expect(MathUtils.returnPercentage(1, 3, '1')).toEqual(0.33333333333333337);
    expect(MathUtils.returnPercentage(10, 3)).toEqual(333.3333333333333);
    expect(MathUtils.returnPercentage(10, 3, '1')).toEqual(3.333333333333333);
  });

  it(`.roundTwoDecimal should return a number rounded to two decimals`, () => {
    expect(MathUtils.roundTwoDecimal(25.5186)).toEqual(25.52);
    expect(MathUtils.roundTwoDecimal(25)).toEqual(25);
    expect(MathUtils.roundTwoDecimal(33.333333333333336)).toEqual(33.33);
  });
});
