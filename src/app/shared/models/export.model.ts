import { Ruleset } from './ruleset.model';
import { Stock } from './stock.model';

export interface Export {
  stocks: Array<Stock>;
  rulesets: Array<Ruleset>;
}
