import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Export } from '../shared/models/export.model';
import { Ruleset } from '../shared/models/ruleset.model';
import { Stock } from '../shared/models/stock.model';
import { LogType } from '../shared/services/log-type.enum';
import { LoggingService } from '../shared/services/logging.service';

/** Calculates the analysis results and manages the necessary data. */
@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  /** The stocks that serve as rows. */
  private rows = new BehaviorSubject<Stock[]>([]);
  /** The stocks that serve as rows. */
  public rows$ = this.rows.asObservable();
  /** The rulesets with which the results are calculated. */
  private rulesets = new BehaviorSubject<Ruleset[]>([]);
  /** The rulesets with which the results are calculated. */
  public rulesets$ = this.rulesets.asObservable();

  constructor(private loggingService: LoggingService) {}

  /** Updates the data entry table and the rulesets for result display using the json passed in parameter. */
  public updateData(json: string): void {
    const data: Export = JSON.parse(json);

    this.loggingService.log(
      LogType.JSON_PARSING,
      'CalculatorService > updateData() - Just received the following:',
      data
    );

    this.rows.next(data.stocks);
    this.rulesets.next(data.rulesets);
  }
}
