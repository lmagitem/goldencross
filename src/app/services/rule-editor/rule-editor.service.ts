import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { CrossingType } from '../../shared/models/crossing-type.model';
import { Ruleset } from '../../shared/models/ruleset.model';

/** Methods used by the {@link RuleEditorComponent}. */
@Injectable({
  providedIn: 'root',
})
export class RuleEditorService {
  constructor(private fb: FormBuilder) {}

  /** Builds a form using the values contained in the given {@link Ruleset}. */
  public buildForm(ruleset: Ruleset): FormGroup {
    return this.fb.group({
      name: [ruleset.name, Validators.required],
      split: this.buildSplit(ruleset.split),
      rules: this.fb.array(
        ruleset.rules.map<FormGroup>((r) =>
          this.fb.group({
            allowedTurns: this.buildAllowedTurns(r.allowedTurns),
            allowedTypes: this.buildAllowedTypes(r.allowedTypes),
            formula: [r.formula, Validators.required],
          })
        )
      ),
    });
  }

  /** Builds a FormArray containing the split values passed in parameter. */
  public buildSplit(split: number[]): FormArray {
    return this.fb.array(
      split.map<FormControl>((n) => this.fb.control(n)),
      Validators.required
    );
  }

  /** Builds a FormArray containing the allowed turns values passed in parameter. */
  public buildAllowedTurns(allowedTurns: number[]): FormArray {
    return this.fb.array(
      allowedTurns.map<FormControl>((t) => this.fb.control(t)),
      Validators.required
    );
  }

  /** Builds a FormArray containing the allowed crossing types values passed in parameter. */
  public buildAllowedTypes(allowedTypes: CrossingType[]): FormArray {
    return this.fb.array(
      allowedTypes.map<FormControl>((t) => this.fb.control(t)),
      Validators.required
    );
  }
}
