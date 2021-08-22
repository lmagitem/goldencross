import { Ruleset } from './ruleset.model';
import { Stock } from './stock.model';

/** Used to store the app's dataset. */
export interface Export {
  stocks: Array<Stock>;
  rulesets: Array<Ruleset>;
}
