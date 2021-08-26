import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { Stock } from 'src/app/shared/models/stock.model';
import { LogType } from 'src/app/shared/enums/log-type.enum';
import { SubSink } from 'subsink';
import { LoggingService } from 'src/app/services/logging.service';

/** A text field in which one can put or retreive the dataset used by the app. */
@Component({
  selector: 'app-json-export',
  templateUrl: './json-export.component.html',
  styleUrls: ['./json-export.component.scss'],
})
export class JsonExportComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** A copy of the data found in dataService, used to prepare the json to display. */
  private stocks: Array<Stock> = [];
  /** A copy of the data found in dataService, used to prepare the json to display. */
  private rulesets: Array<Ruleset> = [];
  /** The json to display. */
  jsonContent = '{}';

  constructor(
    private dataService: DataService,
    private loggingService: LoggingService
  ) {}

  /** When the data changes, make a local copy and update the json to display. */
  ngOnInit(): void {
    this.subs.sink = this.dataService.rows$.subscribe((stocks) => {
      this.stocks = stocks;
      this.updateContent();
    });
    this.subs.sink = this.dataService.rulesets$.subscribe((rulesets) => {
      this.rulesets = rulesets;
      this.updateContent();
    });
  }

  /** Unsubscribe to avoid memory loss. */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Updates what is displayed to the user. */
  updateContent(): void {
    this.jsonContent = JSON.stringify({
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
  onChange(content: any) {
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
      this.dataService.updateData(json);
    }
  }
}
