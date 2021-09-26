import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { isNumeric } from 'mathjs';
import { AnalysisService } from 'src/app/services/analysis/analysis.service';
import { PriceDisplayService } from 'src/app/services/price-display/price-display.service';
import { StateService } from 'src/app/services/state/state.service';
import { industries, Industry } from 'src/app/shared/enums/industry.enum';
import { Sector } from 'src/app/shared/enums/sector.enum';
import { AnalysisResults } from 'src/app/shared/models/analysis-results.model';
import { Period } from 'src/app/shared/models/period.model';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { EnumUtils } from 'src/app/shared/utils/enum.utils';
import { MathUtils } from 'src/app/shared/utils/math.utils';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-results-display',
  templateUrl: './results-display.component.html',
  styleUrls: ['./results-display.component.scss'],
})
export class ResultsDisplayComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** The tab currently shown. */
  currentTab: 'overall' | 'sector' | 'tags' = 'overall';
  /** The list of dynamically generated columns. */
  rulesets: Array<Ruleset> = [];
  /** The entries in the table. */
  stocks: Array<Stock> = [];
  /** List of all periods. */
  periods: Period[] = [];
  /** List of all sectors. */
  sectors = [...industries.keys()];
  /** List of all industries by sector. */
  industries = _.cloneDeep(industries);
  /** List of all tags. */
  tags: string[] = [];
  /** Should I show the rows with specific results for industries? */
  showIndustries = false;
  /** Should I show the rows with specific results for periods? */
  showPeriods = false;

  constructor(
    private priceDisplayService: PriceDisplayService,
    private analysisService: AnalysisService,
    private stateService: StateService
  ) {}

  /** Listens for the list of rows and rules coming from the json export service. */
  public ngOnInit(): void {
    this.subs.sink = this.stateService.stocks$.subscribe((rows) => {
      this.stocks = rows;
      // Update periods
      const periods: Period[] = [];
      this.stocks.forEach((s) =>
        s.analyzedPeriods.forEach((ap) => {
          if (periods.findIndex((p) => p.name === ap.period.name) === -1) {
            periods.push(ap.period);
          }
        })
      );
      this.periods = periods;
      // Update tags
      const tags: string[] = [];
      this.stocks.forEach((s) => {
        s.tags.forEach((t) => {
          if (tags.findIndex((b) => t === b) === -1) {
            tags.push(t);
          }
        });
      });
      this.tags = tags;
    });
    this.subs.sink = this.stateService.rulesets$.subscribe((sets) => {
      this.rulesets = sets;
    });
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Returns a displayable version of the analysis results corresponding to the given data. */
  public getSimpleGrowthAfterTwoYears(ruleset: Ruleset): string {
    let entries = 0;
    let growth = 0;
    this.stocks.forEach((stock) =>
      stock.analyzedPeriods.forEach((anlzdPeriod) => {
        if (anlzdPeriod.resultsPerRulesets !== undefined) {
          const results = anlzdPeriod.resultsPerRulesets?.get(
            this.analysisService.getRulesetHash(anlzdPeriod, ruleset)
          );
          if (results !== undefined) {
            growth += results.gainsAfterTwoYears;
            entries++;
          }
        }
      })
    );

    return MathUtils.isNumeric(growth / entries)
      ? this.priceDisplayService.getGrowthWithClass(growth / entries)
      : '';
  }

  /** Returns a displayable version of the analysis results corresponding to the given data. */
  public getSimplePercentageSpent(ruleset: Ruleset): string {
    let entries = 0;
    let percentage = 0;
    this.stocks.forEach((stock) =>
      stock.analyzedPeriods.forEach((anlzdPeriod) => {
        if (anlzdPeriod.resultsPerRulesets !== undefined) {
          const results = anlzdPeriod.resultsPerRulesets?.get(
            this.analysisService.getRulesetHash(anlzdPeriod, ruleset)
          );
          if (results !== undefined) {
            percentage += results.usedCapital;
            entries++;
          }
        }
      })
    );

    return MathUtils.isNumeric(percentage / entries)
      ? MathUtils.roundTwoDecimal(
          MathUtils.returnPercentage(percentage / entries, 1)
        ) + '%'
      : '';
  }

  public getSectorResults(
    ruleset: Ruleset,
    sector: Sector,
    industry: Industry | undefined,
    period: Period | undefined
  ): string {
    const analysisResults: AnalysisResults[] = [];

    this.stocks.forEach((stock) => {
      if (sector === undefined || stock.sector === sector) {
        if (industry === undefined || stock.industry === industry) {
          stock.analyzedPeriods.forEach((anlzdPeriod) => {
            if (
              period === undefined ||
              anlzdPeriod.period.name === period.name
            ) {
              if (anlzdPeriod.resultsPerRulesets !== undefined) {
                const results = anlzdPeriod.resultsPerRulesets?.get(
                  this.analysisService.getRulesetHash(anlzdPeriod, ruleset)
                );
                if (results !== undefined) {
                  analysisResults.push(results);
                }
              }
            }
          });
        }
      }
    });

    return analysisResults.length > 0
      ? this.priceDisplayService.getGrowthAndCapitalSpentWithClass(
          analysisResults
            .map((r) => r.gainsAfterTwoYears)
            .reduce(
              (a, b) => Number.parseFloat(a + '') + Number.parseFloat(b + ''),
              0
            ) / analysisResults.length,
          analysisResults
            .map((r) => r.usedCapital)
            .reduce(
              (a, b) => Number.parseFloat(a + '') + Number.parseFloat(b + ''),
              0
            ) / analysisResults.length
        )
      : '';
  }

  public getTagResults(
    ruleset: Ruleset,
    tag: string,
    period: Period | undefined
  ): string {
    const analysisResults: AnalysisResults[] = [];

    this.stocks.forEach((stock) => {
      if (
        stock.tags !== undefined &&
        stock.tags.findIndex((t) => t === tag) !== -1
      ) {
        stock.analyzedPeriods.forEach((anlzdPeriod) => {
          if (period === undefined || anlzdPeriod.period.name === period.name) {
            if (anlzdPeriod.resultsPerRulesets !== undefined) {
              const results = anlzdPeriod.resultsPerRulesets?.get(
                this.analysisService.getRulesetHash(anlzdPeriod, ruleset)
              );
              if (results !== undefined) {
                analysisResults.push(results);
              }
            }
          }
        });
      }
    });

    return analysisResults.length > 0
      ? this.priceDisplayService.getGrowthAndCapitalSpentWithClass(
          analysisResults
            .map((r) => r.gainsAfterTwoYears)
            .reduce(
              (a, b) => Number.parseFloat(a + '') + Number.parseFloat(b + ''),
              0
            ) / analysisResults.length,
          analysisResults
            .map((r) => r.usedCapital)
            .reduce(
              (a, b) => Number.parseFloat(a + '') + Number.parseFloat(b + ''),
              0
            ) / analysisResults.length
        )
      : '';
  }

  /** Returns a simple formatted date. */
  public formatDate(date: Date): string {
    return this.priceDisplayService.getPriceTimestamp(date);
  }

  /** Returns a somewhat readable string from an enum value. */
  public enumToString(o: any): string {
    return EnumUtils.enumToString(o);
  }
}
