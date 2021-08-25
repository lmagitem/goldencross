import { evaluate } from 'mathjs';
import { StringUtils } from './string.utils';

/** Helper functions for anything math related. */
export class MathUtils {
  /** Does the given variable contains something that can be interpreted as a number? */
  public static isNumeric(n: any): boolean {
    n = typeof n === 'string' ? n.replace(new RegExp(/\s/g), '') : n;
    return !isNaN(parseFloat(n)) && isFinite(n);
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
}
