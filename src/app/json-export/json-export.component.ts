import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { CalculatorService } from '../calculator/calculator.service';
import { Ruleset } from '../shared/models/ruleset.model';
import { Stock } from '../shared/models/stock.model';

@Component({
  selector: 'app-json-export',
  templateUrl: './json-export.component.html',
  styleUrls: ['./json-export.component.scss'],
})
export class JsonExportComponent implements OnInit {
  private subs: SubSink = new SubSink();
  private stocks: Array<Stock> = [];
  private rulesets: Array<Ruleset> = [];
  jsonContent = '{}';

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.subs.sink = this.calculatorService.rows$.subscribe((stocks) => {
      this.stocks = stocks;
      this.updateContent();
    });
    this.subs.sink = this.calculatorService.rulesets$.subscribe((rulesets) => {
      this.rulesets = rulesets;
      this.updateContent();
    });
  }

  updateContent(): void {
    this.jsonContent = JSON.stringify({
      stocks: this.stocks,
      rulesets: this.rulesets,
    });

    console.log(
      'JsonExportComponent > updateContent() - Just updated the json:',
      this.jsonContent
    );
  }

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
      this.calculatorService.updateData(json);
    }
  }
}
