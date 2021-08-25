import { CrossingType } from '../enums/crossing-type.enum';

/** A rule allowing to decide if we want to buy or not. */
export interface Rule {
  /** The turns at which this rule is allowed to be executed. */
  turnsAllowed: Array<number>;
  /** The crossings at which this rule is allowed to be executed. */
  typesAllowed: Array<CrossingType>;
  /** The formula used to compare values. See {@link CalculatorUtils} for details. */
  formula: string;
}
