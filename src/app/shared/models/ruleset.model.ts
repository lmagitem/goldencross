import { Rule } from './rule.model';

/** A ruleset to follow in order to decide if we want to buy or not. */
export interface Ruleset {
  name: string;
  split: number;
  rules: Array<Rule>;
}
