import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Export } from '../shared/models/export.model';
import { Ruleset } from '../shared/models/ruleset.model';
import { Stock } from '../shared/models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private rows = new BehaviorSubject<Stock[]>([]);
  public rows$ = this.rows.asObservable();
  private rulesets = new BehaviorSubject<Ruleset[]>([]);
  public rulesets$ = this.rulesets.asObservable();

  constructor() {}

  public updateData(json: string): void {
    const data: Export = JSON.parse(json);

    console.log(
      'CalculatorService > updateData() - Just received the following:',
      data
    );

    this.rows.next(data.stocks);
    this.rulesets.next(data.rulesets);
  }
}
