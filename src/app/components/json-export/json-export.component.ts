import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { LogType } from 'src/app/shared/enums/log-type.enum';
import { SubSink } from 'subsink';
import { delay, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { StateService } from 'src/app/services/state/state.service';
import { LoggingService } from 'src/app/services/logging/logging.service';

/** A text field in which one can put or retreive the dataset used by the app. */
@Component({
  selector: 'app-json-export',
  templateUrl: './json-export.component.html',
  styleUrls: ['./json-export.component.scss'],
})
export class JsonExportComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** A copy of the data found in stateService, used to prepare the json to display. */
  private apiToken: string = '';
  /** A copy of the data found in stateService, used to prepare the json to display. */
  private stocks: Array<Stock> = [];
  /** A copy of the data found in stateService, used to prepare the json to display. */
  private rulesets: Array<Ruleset> = [];
  /** The json to display. */
  jsonContent = '';

  constructor(
    private stateService: StateService,
    private loggingService: LoggingService
  ) {}

  /** When the data changes, make a local copy and update the json to display. */
  public ngOnInit(): void {
    this.stateService.restoreState();

    this.subs.sink = combineLatest([
      this.stateService.apiToken$,
      this.stateService.rows$,
      this.stateService.rulesets$,
    ])
      .pipe(
        map((results) => ({
          apiToken: results[0],
          rows: results[1],
          rulesets: results[2],
        }))
      )
      .pipe(delay(150))
      .subscribe((results: { apiToken: any; rows: any; rulesets: any }) => {
        this.apiToken = results.apiToken;
        this.stocks = results.rows;
        this.rulesets = results.rulesets;
        this.updateContent();
      });
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Updates what is displayed to the user. */
  public updateContent(): void {
    this.jsonContent = JSON.stringify({
      apiToken: this.apiToken,
      stocks: this.stocks,
      rulesets: this.rulesets,
    });

    this.loggingService.log(
      LogType.JSON_PARSING,
      'JsonExportComponent > updateContent() - Just updated the json:',
      this.jsonContent
    );
  }

  /** When the user types something, if it's a valid piece of json, send it forward to the data. */
  public onChange(content: any) {
    const json = content.target?.value
      ? content.target.value
      : this.jsonContent;

    // Check if valid json
    if (
      /^[\],:{}\s]*$/.test(
        json
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            ']'
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    ) {
      this.stateService.updateDataFromJson(json);
    }
  }
}
