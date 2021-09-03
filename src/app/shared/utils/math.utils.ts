import { evaluate } from 'mathjs';
import { StringUtils } from './string.utils';

/** Helper functions for anything math related. */
export class MathUtils {
  /** A regex formula to detect whitespaces. */
  public static WHITESPACE_REGEX: RegExp = new RegExp(/\s/g);
  /** A regex formula to detect numbers being typed (the . is allowed not to be followed by numbers). */
  public static TYPING_NUMBER_REGEX: RegExp = new RegExp(
    /^[0-9]+(\.[0-9]*){0,1}$/g
  );
  /** A regex formula to detect numbers with up to two decimals. */
  public static TWO_DIGITS_DECIMAL_REGEX: RegExp = new RegExp(
    /^\d+(\.\d{1,2})?$/
  );

  /** Does the given variable contains something that can be interpreted as a number? */
  public static isNumeric(n: any): boolean {
    n = typeof n === 'string' ? n.replace(MathUtils.WHITESPACE_REGEX, '') : n;
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /** Does the given variable contains something that can be interpreted as an integer? */
  public static isInteger(n: any): boolean {
    n = typeof n === 'string' ? n.replace(MathUtils.WHITESPACE_REGEX, '') : n;
    return (
      MathUtils.isNumeric(n) &&
      (Number.isInteger(n) ||
        (typeof n === 'string' && Number.isInteger(parseFloat(n))))
    );
  }

  /** Does the given variable contains something that can be interpreted as a number being typed? */
  public static isNumericBeingTyped(n: any): boolean {
    n = typeof n === 'string' ? n.replace(MathUtils.WHITESPACE_REGEX, '') : n;
    return (
      n && StringUtils.findMatches(MathUtils.TYPING_NUMBER_REGEX, n).length > 0
    );
  }

  /** Does the given variable contains something that can be interpreted as a number with two decimals? */
  public static isNumericTwoDigits(n: any): boolean {
    n = typeof n === 'string' ? n.replace(MathUtils.WHITESPACE_REGEX, '') : n;
    return (
      MathUtils.isNumeric(n) &&
      StringUtils.findMatches(MathUtils.TWO_DIGITS_DECIMAL_REGEX, n).length > 0
    );
  }

  /** Does the given variable contains something that can be interpreted as a number? Accepts numbers with ',' instead of '.' */
  public static isNumericAcceptFrenchLocale(n: any): boolean {
    n = StringUtils.replaceAll(n, ',', '.');
    return this.isNumeric(n);
  }

  /** Dynamically evaluates a formula and returns its result. Safer than eval(). */
  public static evaluateOrZero(formula: string): number {
    try {
      const result = evaluate(formula);
      return this.isNumeric(result) ? result : 0;
    } catch {
      return 0;
    }
  }

  /** Returns the percentage of the first given number in relation to the second one. */
  public static returnPercentage(
    numberToReturnAsPercentage: number,
    numberToUseAsHundredPercent: number,
    aHundredPercent: '1' | '100' = '100'
  ): number {
    const percent =
      (numberToReturnAsPercentage * 100) / numberToUseAsHundredPercent;
    return aHundredPercent === '1' ? percent / 100 : percent;
  }

  /** Rounds the given number to two decimals. */
  public static roundTwoDecimal(numberToRound: number): number {
    return Math.round(numberToRound * 100) / 100;
  }
}
