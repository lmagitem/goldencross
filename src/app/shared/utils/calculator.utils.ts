import { AnalysisResults } from '../models/analysis-results.model';
import { CrossingType } from '../models/crossing-type.model';
import { GoldenCross } from '../models/golden-cross.model';
import { AnalysedPeriod } from '../models/period.model';
import { Rule } from '../models/rule.model';
import { Ruleset } from '../models/ruleset.model';
import { Stock } from '../models/stock.model';
import { MathUtils } from './math.utils';
import { StringUtils } from './string.utils';

/** Helper functions for the analysis process. */
export class CalculatorUtils {
  /** After being fed the necessary data, executes the buy strategy represented by the given ruleset.
   *  @description Usable keywords for the formula are: "avg", "last-used", "last-of-type", "curr", "prev-high" */
  public static processDataWithRuleset(
    stock: Stock,
    period: AnalysedPeriod,
    ruleset: Ruleset
  ): AnalysisResults {
    const lastOfTypes: Map<CrossingType, number> = new Map();
    const previousHigh = period.previousHigh;
    const priceTwoYears = period.priceTwoYears;
    let costAverage = previousHigh;
    let lastUsed = previousHigh;
    let gainsAfterTwoYears = 0;
    let usedCapital = 0;
    let lastBuy: Date | undefined = undefined;
    let found = false;
    let log =
      stock.name + ' > ' + period.name + ' > ' + ruleset.name + ' - Bought ';

    // Perform buying simulation
    for (let turn = 1; turn <= ruleset.split; turn++) {
      found = false;
      // During each turn, checks each rule to see if it is applicable to this turn number
      for (const rule of ruleset.rules) {
        if (!found && rule.turnsAllowed.includes(turn)) {
          // Then checks in all the data from the period, and keeps the crossings allowed by the rule
          for (const crossing of period.crossings) {
            if (
              !found &&
              rule.typesAllowed.findIndex(
                (t) =>
                  crossing.type.firstMA === t.firstMA &&
                  crossing.type.intoMA === t.intoMA
              ) !== -1
            ) {
              // Finally, uses the entry if it happened after the last one used
              if (
                lastBuy === undefined ||
                new Date(crossing.timestamp) > lastBuy
              ) {
                // Prepare the formula and dynamically calculate its result
                const result = MathUtils.evaluateOrZero(
                  CalculatorUtils.getFormula(
                    rule,
                    costAverage,
                    previousHigh,
                    lastUsed,
                    lastOfTypes,
                    crossing
                  )
                );

                // If the condition in the formula was met, saves everything and end the turn
                if (result !== -1) {
                  costAverage =
                    Math.round(
                      (turn === 1
                        ? result
                        : (costAverage * turn + result) / (turn + 1)) * 100
                    ) / 100;
                  usedCapital =
                    usedCapital + Math.round((1 / ruleset.split) * 100) / 100;

                  lastOfTypes.set(crossing.type, result);
                  lastBuy = new Date(crossing.timestamp);
                  lastUsed = result;
                  found = true;

                  log +=
                    (turn !== 1 ? ', ' : '') +
                    1 / ruleset.split +
                    ' at ' +
                    result;
                }
              }
            }
          }
        }
      }
    }

    // Completes the log after the analysis
    if (usedCapital === 0) {
      log += 'nothing.';
    } else {
      log += ' for a cost average of ' + costAverage;
    }

    // And calculates growth percentage before returning the results
    gainsAfterTwoYears =
      Math.round(
        (priceTwoYears === costAverage
          ? 0
          : priceTwoYears > costAverage
          ? (priceTwoYears - costAverage) / costAverage
          : -(costAverage - priceTwoYears) / costAverage) * 100
      ) / 100;

    return { costAverage, gainsAfterTwoYears, usedCapital, log };
  }

  /** Prepares the formula by replacing the keywords with actual numbers. */
  private static getFormula(
    rule: Rule,
    costAverage: number,
    previousHigh: number,
    lastUsed: number,
    lastOfTypes: Map<CrossingType, number>,
    crossing: GoldenCross
  ) {
    const lastOfType: number = MathUtils.isNumeric(
      lastOfTypes.get(crossing.type)
    )
      ? (lastOfTypes.get(crossing.type) as number)
      : previousHigh;

    let formula = rule.formula;
    formula = StringUtils.replaceAll(formula, 'avg', costAverage);
    formula = StringUtils.replaceAll(formula, 'last-used', lastUsed);
    formula = StringUtils.replaceAll(formula, 'last-of-type', lastOfType);
    formula = StringUtils.replaceAll(formula, 'curr', crossing.price);
    formula = StringUtils.replaceAll(formula, 'prev-high', previousHigh);
    return formula;
  }
}
