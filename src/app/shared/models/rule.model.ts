import { CrossingType } from './crossing-type.model';

/** A rule allowing to decide if we want to buy or not. */
export interface Rule {
  /** The turns at which this rule is allowed to be executed. */
  allowedTurns: Array<number>;
  /** The crossings at which this rule is allowed to be executed. */
  allowedTypes: Array<CrossingType>;
  /** The formula used to compare values. See {@link CalculatorUtils} for details. */
  formula: string;
}
