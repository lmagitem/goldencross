import { Injectable } from '@angular/core';
import { AnalysisResults } from 'src/app/shared/models/analysis-results.model';
import { CrossingType } from 'src/app/shared/models/crossing-type.model';
import { PriceAtCrossing } from 'src/app/shared/models/golden-cross.model';
import { AnalysedPeriod } from 'src/app/shared/models/analysed-period.model';
import { Rule } from 'src/app/shared/models/rule.model';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { MathUtils } from 'src/app/shared/utils/math.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { PriceService } from '../price/price.service';
import { Period } from 'src/app/shared/models/period.model';
import * as _ from 'lodash';
import { EntryPoint } from 'src/app/shared/models/entry-point.model';
import { number } from 'mathjs';

/** Provides functions to analyse and process price movements. */
@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  constructor(private priceService: PriceService) {}

  /** After being fed the necessary data, executes the buy strategy represented by the given ruleset.
   *  @description Usable keywords for the formula are: "avg", "last-used", "last-of-type", "curr", "price-before" */
  public processDataWithRuleset(
    stock: Stock,
    anlzdPeriod: AnalysedPeriod,
    ruleset: Ruleset
  ): AnalysisResults {
    const entries: EntryPoint[] = [];
    let results: AnalysisResults | undefined;

    // If we already calculated a value for this, reuse it
    if (
      anlzdPeriod.resultsPerRulesets !== undefined &&
      anlzdPeriod.resultsPerRulesets instanceof Map
    ) {
      results = anlzdPeriod.resultsPerRulesets.get(
        this.getRulesetHash(anlzdPeriod, ruleset)
      );
      if (results !== undefined) {
        return results;
      }
    }

    // Else begin the process
    const lastOfTypes: Map<CrossingType, number> = new Map();
    const priceBefore = anlzdPeriod.priceBefore;
    const priceTwoYears = anlzdPeriod.priceTwoYears;
    let costAverage = priceBefore;
    let lastUsed = priceBefore;
    let gainsAfterTwoYears = 0;
    let usedCapital = 0;
    let lastBuy: Date | undefined = undefined;
    let found = false;
    let log =
      stock.name +
      ' > ' +
      anlzdPeriod.period.name +
      ' > ' +
      ruleset.name +
      ' - Bought ';

    // Perform buying simulation
    for (let turn = 1; turn <= ruleset.split.length; turn++) {
      found = false;
      // During each turn, checks each rule to see if it is applicable to this turn number
      for (let r = 1; r <= ruleset.rules.length; r++) {
        const rule = ruleset.rules[r - 1];
        if (!found && rule.allowedTurns.includes(turn)) {
          // Then checks in all the data from the period, and keeps the crossings allowed by the rule
          for (const crossing of anlzdPeriod.crossings) {
            if (
              !found &&
              rule.allowedTypes.findIndex(
                (t) =>
                  crossing.type.fromMA === t.fromMA &&
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
                  this.getFormula(
                    rule,
                    costAverage,
                    priceBefore,
                    lastUsed,
                    lastOfTypes,
                    crossing
                  )
                );

                const currentSplit = MathUtils.returnPercentage(
                  ruleset.split[turn - 1],
                  ruleset.split.reduce(
                    (a, b) =>
                      Number.parseFloat(a + '') + Number.parseFloat(b + ''),
                    0
                  ),
                  '1'
                );

                // If the condition in the formula was met, saves everything and end the turn
                if (result !== -1) {
                  costAverage = MathUtils.roundTwoDecimal(
                    turn === 1
                      ? result
                      : (costAverage * usedCapital + result * currentSplit) /
                          (usedCapital + currentSplit)
                  );
                  usedCapital = usedCapital + currentSplit;

                  lastOfTypes.set(crossing.type, result);
                  lastBuy = new Date(crossing.timestamp);
                  lastUsed = result;
                  found = true;

                  entries.push({
                    date: new Date(crossing.timestamp),
                    price: result,
                    spent: currentSplit,
                  });
                  log +=
                    (turn !== 1 ? ', ' : '') +
                    Math.round(currentSplit * 100) +
                    '% at ' +
                    result +
                    ' (rule ' +
                    r +
                    ')';
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
      usedCapital === 0
        ? 0
        : MathUtils.roundFourDecimal(
            this.priceService.calculateGrowth(costAverage, priceTwoYears)
          );

    // Save the results before returning them
    results = { costAverage, gainsAfterTwoYears, usedCapital, entries, log };
    if (
      anlzdPeriod.resultsPerRulesets === undefined ||
      !(anlzdPeriod.resultsPerRulesets instanceof Map)
    ) {
      anlzdPeriod.resultsPerRulesets = new Map();
    }
    anlzdPeriod.resultsPerRulesets.set(
      this.getRulesetHash(anlzdPeriod, ruleset),
      results
    );

    return results;
  }

  /** Returns a hash to be used to recognize the results of an analysis for a specific state of an {@link AnalysedPeriod} and a {@link Ruleset}. */
  public getRulesetHash(anlzdPeriod: AnalysedPeriod, ruleset: Ruleset): string {
    return (
      anlzdPeriod.crossings.length +
      anlzdPeriod.crossings.map((c) => c.type).reduce((a, b) => a + b, '') +
      JSON.stringify(ruleset)
    );
  }

  /** Prepares the formula by replacing the keywords with actual numbers. */
  private getFormula(
    rule: Rule,
    costAverage: number,
    priceBefore: number,
    lastUsed: number,
    lastOfTypes: Map<CrossingType, number>,
    crossing: PriceAtCrossing
  ) {
    const lastOfType: number = MathUtils.isNumeric(
      lastOfTypes.get(crossing.type)
    )
      ? (lastOfTypes.get(crossing.type) as number)
      : priceBefore;

    let formula = rule.formula;
    formula = StringUtils.replaceAll(formula, 'avg', costAverage);
    formula = StringUtils.replaceAll(formula, 'last-used', lastUsed);
    formula = StringUtils.replaceAll(formula, 'last-of-type', lastOfType);
    formula = StringUtils.replaceAll(formula, 'curr', crossing.price);
    formula = StringUtils.replaceAll(formula, 'price-before', priceBefore);
    return formula;
  }
}
