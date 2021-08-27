import { Injectable } from '@angular/core';
import { Timescale } from '../shared/enums/timescale.enum';
import { AnalysisResults } from '../shared/models/analysis-results.model';
import { CrossingType } from '../shared/models/crossing-type.model';
import { GoldenCross } from '../shared/models/golden-cross.model';

/** Methods to manage how are prices displayed in the app. */
@Injectable({
  providedIn: 'root',
})
export class PriceDisplayService {
  /** Returns a timestamp formatted to display, with more or less infos depending on the timescale. */
  public getPriceTimestamp(timestamp: Date, timescale: Timescale) {
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

  /** What score this price can be given in comparison to the other given parameters. */
  public getPriceAppreciation(
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
  public getGrowthScore(growth: number): number {
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

  /** Returns a "score" usable to return a css class to a MA. */
  public getMAScore(ma: number): number {
    return ma <= 20
      ? 13
      : ma <= 40
      ? 30
      : ma <= 75
      ? 50
      : ma <= 125
      ? 100
      : ma <= 175
      ? 150
      : 200;
  }

  /** Returns a displayable version of the data contained in a {@link GoldenCross}. */
  public getGoldenCrossWithClass(
    goldenCross: GoldenCross,
    getPriceAppreciationScore = (n: number) => 0
  ): string {
    return (
      '<span class="' +
      this.getPriceClass(getPriceAppreciationScore(goldenCross.price)) +
      '">' +
      (Math.round(goldenCross.price * 100) / 100).toFixed(2) +
      '</span><br>' +
      this.getPriceTimestamp(goldenCross.timestamp, goldenCross.timescale)
    );
  }

  /** Returns a string usable in html to display the given analysis results with proper formatting. */
  public getAnalysisResultsWithClass(results: AnalysisResults): string {
    return (
      '<span class="' +
      this.getPriceClass(this.getGrowthScore(results.gainsAfterTwoYears)) +
      '">' +
      (results.gainsAfterTwoYears >= 0 ? '+' : '') +
      Math.round(results.gainsAfterTwoYears * 100) +
      '%</span><br><span class="smaller">avg: ' +
      results.costAverage +
      '<br>used: ' +
      Math.round(results.usedCapital * 100) +
      '%</span>'
    );
  }

  /** Returns a string usable in html to display the crossings column headers with pretty colors. */
  public getCrossingWithClass(type: CrossingType): string {
    return (
      this.getMAClass(type.firstMA, this.getMAScore(type.firstMA)) +
      '↗️' +
      this.getMAClass(type.intoMA, this.getMAScore(type.intoMA))
    );
  }

  /** Returns the css class corresponding to the given score. */
  public getPriceClass(score: number): string {
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

  /** Returns a css class for a given MA using a score that can be generated by this.getMAScore(). */
  public getMAClass(ma: number, score: number) {
    switch (score) {
      case 13:
        return '<span class="cros-thirteen">' + ma + '</span>';
      case 30:
        return '<span class="cros-thirty">' + ma + '</span>';
      case 50:
        return '<span class="cros-fifty">' + ma + '</span>';
      case 100:
        return '<span class="cros-hundred">' + ma + '</span>';
      case 150:
        return '<span class="cros-hundred-and-fifty">' + ma + '</span>';
      case 200:
        return '<span class="cros-two-hundred">' + ma + '</span>';
      default:
        return '';
    }
  }
}
