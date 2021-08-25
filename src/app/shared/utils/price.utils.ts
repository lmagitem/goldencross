import { CrossingType } from '../enums/crossing-type.enum';
import { Timescale } from '../enums/timescale.enum';
import { AnalysisResults } from '../models/analysis-results.model';

/** Helper functions for anything price related. */
export class PriceUtils {
  /** What score this price can be given in comparison to the other given parameters. */
  public static getPriceAppreciation(
    price: number,
    nextHigh: number,
    prevHigh: number,
    low: number
  ): number {
    let score = 0;
    if (price > nextHigh || price > prevHigh) {
      score = -1;
    } else if (price < nextHigh) {
      const tranche = (nextHigh - low) / 5;
      if (price <= low + tranche) {
        score = 5;
      } else if (price <= low + tranche * 2) {
        score = 4;
      } else if (price <= low + tranche * 3) {
        score = 3;
      } else if (price <= low + tranche * 4) {
        score = 2;
      } else {
        score = 1;
      }
    }
    return score;
  }

  /** What score this growth rate can be given? */
  public static getGrowthScore(growth: number): number {
    let score = 0;
    if (growth < 0) {
      score = -1;
    } else if (growth > 1) {
      score = 5;
    } else if (growth > 0.75) {
      score = 4;
    } else if (growth > 0.5) {
      score = 3;
    } else if (growth > 0.25) {
      score = 2;
    } else {
      score = 1;
    }
    return score;
  }

  /** Returns a timestamp formatted to display, with more or less infos depending on the timescale. */
  public static getPriceTimestamp(timestamp: Date, timescale: Timescale) {
    return timescale === Timescale.FH
      ? timestamp.toLocaleDateString('en-UK', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      : timestamp.toLocaleDateString('en-UK', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
  }

  /** Returns a string usable in html to display the given analysis results with proper formatting. */
  public static getAnalysisResultsWithClass(results: AnalysisResults): string {
    return (
      '<span class="' +
      PriceUtils.getPriceClass(
        PriceUtils.getGrowthScore(results.gainsAfterTwoYears)
      ) +
      '">' +
      (results.gainsAfterTwoYears >= 0 ? '+' : '') +
      results.gainsAfterTwoYears * 100 +
      '%</span><br><span class="smaller">avg: ' +
      results.costAverage +
      '<br>used: ' +
      Math.round(results.usedCapital * 100) +
      '%</span>'
    );
  }

  /** Returns the css class corresponding to the given score. */
  public static getPriceClass(score: number): string {
    switch (score) {
      case -1:
        return 'neg-price';
      case 0:
        return 'neutral-price';
      case 1:
        return 'pos-one-price';
      case 2:
        return 'pos-two-price';
      case 3:
        return 'pos-three-price';
      case 4:
        return 'pos-four-price';
      case 5:
        return 'pos-five-price';
      default:
        return '';
    }
  }

  /** Returns a string usable in html to display the crossings column headers with pretty colors. */
  public static getCrossingWithClass(type: CrossingType): string {
    switch (type) {
      case '13↗️30':
        return '<span class="cros-thirteen">13</span>↗️<span class="cros-thirty">30</span>';
      case '13↗️50':
        return '<span class="cros-thirteen">13</span>↗️<span class="cros-fifty">50</span>';
      case '13↗️100':
        return '<span class="cros-thirteen">13</span>↗️<span class="cros-hundred">100</span>';
      case '13↗️150':
        return '<span class="cros-thirteen">13</span>↗️<span class="cros-hundred-and-fifty">150</span>';
      case '30↗️50':
        return '<span class="cros-thirty">30</span>↗️<span class="cros-fifty">50</span>';
      case '30↗️100':
        return '<span class="cros-thirty">30</span>↗️<span class="cros-hundred">100</span>';
      case '50↗️100':
        return '<span class="cros-fifty">50</span>↗️<span class="cros-hundred">100</span>';
      case '100↗️150':
        return '<span class="cros-hundred">100</span>↗️<span class="cros-hundred-and-fifty">150</span>';
      case '100↗️200':
        return '<span class="cros-hundred">100</span>↗️<span class="cros-two-hundred">200</span>';
      default:
        return '';
    }
  }
}
