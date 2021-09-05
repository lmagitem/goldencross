import { Ruleset } from './ruleset.model';
import { Stock } from './stock.model';

/** Used to store the app's dataset. */
export interface Export {
  apiToken: string;
  stocks: Array<Stock>;
  rows: Array<Stock>;
  rulesets: Array<Ruleset>;
}
