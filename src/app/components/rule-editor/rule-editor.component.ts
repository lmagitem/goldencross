import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { first } from 'rxjs/operators';
import { StateService } from 'src/app/services/state/state.service';
import { PriceDisplayService } from 'src/app/services/price-display/price-display.service';
import { RuleEditorService } from 'src/app/services/rule-editor/rule-editor.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CrossingType } from 'src/app/shared/models/crossing-type.model';
import { Ruleset } from 'src/app/shared/models/ruleset.model';
import { StringableKeyValuePair } from 'src/app/shared/models/stringable-key-value-pair.model';
import { MathUtils } from 'src/app/shared/utils/math.utils';
import { ModalUtils } from 'src/app/shared/utils/modal.utils';
import { SubSink } from 'subsink';
import { ReactiveFormUtils } from 'src/app/shared/utils/reactive-form.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';

/** A form that enables to create and edit rulesets. */
@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss'],
})
export class RuleEditorComponent implements OnInit, OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** An empty ruleset to be copied when making new forms. */
  private emptyRuleset = {
    name: '',
    split: [],
    rules: [{ allowedTypes: [], allowedTurns: [], formula: '' }],
  };
  /** The ruleset form currently edited. */
  rulesetForm = this.ruleEditorService.buildForm(
    _.cloneDeep(this.emptyRuleset)
  );
  /** The list of all ruleset forms. */
  rulesetForms = [this.rulesetForm];
  /** Index of the rule currently shown. */
  activeRule = 0;
  /** Current value in the new split field. */
  currentSplit = '';
  /** Current value in the new turn field. */
  selectedTurn = 0;
  /** Current value in the new crossing field. */
  newCrossing: CrossingType = { fromMA: 0, intoMA: 0 };

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private stateService: StateService,
    private priceDisplayService: PriceDisplayService,
    private ruleEditorService: RuleEditorService
  ) {}

  /** Load the current ruleset. */
  public ngOnInit(): void {
    this.subs.sink = this.stateService.rulesets$.subscribe((rulesets) => {
      this.updateRulesets(rulesets);
    });
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Returns all the current ruleset's rules. */
  public getRules(): FormArray {
    return this.rulesetForm.get('rules') as FormArray;
  }

  /** Returns all the current ruleset's splits. */
  public getSplits(): FormArray {
    return this.rulesetForm.get('split') as FormArray;
  }

  /** Returns the given rule's allowed turns. */
  public getAllowedTurns(rule: AbstractControl): FormArray {
    return rule.get('allowedTurns') as FormArray;
  }

  /** Returns the given rule's allowed crossing types. */
  public getAllowedTypes(rule: AbstractControl): FormArray {
    return rule.get('allowedTypes') as FormArray;
  }

  /** Returns the given rule's formula. */
  public getFormula(rule: AbstractControl): string {
    const formula = rule.get('formula')?.value;
    return formula !== undefined
      ? StringUtils.replaceAll(formula, '? curr : -1', '')
      : '';
  }

  /** Returns the list of all the turns that can be selected in the allowed turns selector. That is those that aren't already selected. */
  public getNonAllocatedTurns(rule: AbstractControl): number[] {
    const availableTurns: number[] = [];
    for (
      let turn = 1;
      turn <= (this.rulesetForm.controls['split'] as FormArray).controls.length;
      turn++
    ) {
      let alreadyTaken = false;
      for (const alreadySelectedTurn of (rule.get('allowedTurns') as FormArray)
        .controls) {
        // Checks for each split if it has an already allocated allowed turn.
        if (alreadySelectedTurn.value + '' === turn + '') {
          alreadyTaken = true;
          break;
        }
      }
      if (!alreadyTaken) {
        // Obviously, if it's not taken, add it to the list.
        availableTurns.push(turn);
      }
    }
    if (this.selectedTurn === 0 && availableTurns.length > 0) {
      this.selectedTurn = availableTurns[0];
    }
    return availableTurns;
  }

  /** Transforms the given array into a {@link StringableKeyValuePair} array that can be fed to the {@link ClosableTagComponent}s. */
  public toTags(
    array: AbstractControl[],
    type: 'split' | 'turn' | 'crossing'
  ): StringableKeyValuePair<any>[] {
    const result: StringableKeyValuePair<any>[] = [];
    if (type === 'crossing') {
      for (let i = 0; i < array.length; i++) {
        const crossing = array[i].value;
        result.push(
          new StringableKeyValuePair(i, crossing, (data: CrossingType) =>
            this.priceDisplayService.getMACrossingWithClass(data)
          )
        );
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        const n = array[i].value;
        result.push(
          new StringableKeyValuePair(i, n, (data: number) => data + '')
        );
      }
    }
    return result;
  }

  /** Is the split value entered by the user valid? */
  public isCurrentSplitValid(): boolean {
    return MathUtils.isNumericTwoDigits(this.currentSplit);
  }

  /** Updates the value of the current split using what the user typed into the corresponding input. */
  public updateCurrentSplit(event: any) {
    this.currentSplit = (event.target as HTMLInputElement).value;
  }

  /** Updates the value of the selected turn using what the user selected into the corresponding input. */
  public updateSelectedTurn(event: any) {
    this.selectedTurn = parseInt((event.target as HTMLInputElement).value);
  }

  /** Updates the value of the current crossing type using what the user typed into the corresponding input. */
  public updateNewCrossing(event: any, crossing: 'from' | 'into') {
    if (crossing === 'from') {
      this.newCrossing.fromMA = parseInt(
        (event.target as HTMLInputElement).value
      );
    } else {
      this.newCrossing.intoMA = parseInt(
        (event.target as HTMLInputElement).value
      );
    }
  }

  /** Updates the value of the formula using what the user typed into the corresponding input. */
  public updateFormula(rule: AbstractControl, event: any) {
    (rule as FormGroup).controls['formula'].patchValue(
      (event.target as HTMLInputElement).value + '? curr : -1'
    );
  }

  /** Uses the given array retreived from a {@link ClosableTagComponent} to update the form's split field. */
  public updateSplits(splits: Array<StringableKeyValuePair<any>>) {
    // First remove the split that has been removed
    ReactiveFormUtils.onlyKeepCorrespondingValues(
      this.rulesetForm.controls['split'] as FormArray,
      splits.map((i) => i.data)
    );

    // Then remove every allowed turn that is greater than the number of turns (splits)
    for (const control of (this.rulesetForm.controls['rules'] as FormArray)
      .controls) {
      let failsafe = (control.get('allowedTurns') as FormArray).value.length;
      while (
        failsafe >= 0 &&
        (control.get('allowedTurns') as FormArray).value.findIndex(
          (a: number) => a > splits.length
        ) !== -1
      ) {
        (control.get('allowedTurns') as FormArray).removeAt(
          (control.get('allowedTurns') as FormArray).value.findIndex(
            (a: number) => a > splits.length
          )
        );
        failsafe--;
      }
    }
  }

  /** Uses the given array retreived from a {@link ClosableTagComponent} to update the rule's allowed turns. */
  public updateAllowedTurns(
    rule: AbstractControl,
    turns: Array<StringableKeyValuePair<any>>
  ) {
    ReactiveFormUtils.onlyKeepCorrespondingValues(
      (rule as FormGroup).controls['allowedTurns'] as FormArray,
      turns.map((i) => i.data)
    );
  }

  /** Uses the given array retreived from a {@link ClosableTagComponent} to update the rule's allowed crossing types. */
  public updateAllowedTypes(
    rule: AbstractControl,
    types: Array<StringableKeyValuePair<any>>
  ) {
    ReactiveFormUtils.onlyKeepCorrespondingValues(
      (rule as FormGroup).controls['allowedTypes'] as FormArray,
      types.map((i) => i.data)
    );
  }

  /** When the user clicks on the tab for another ruleset, asks if he wants to save the active one first. */
  public changeActiveRuleset(ruleset: FormGroup) {
    if (this.rulesetForm.dirty) {
      const modalRef = this.modalService.open(ConfirmModalComponent);
      ModalUtils.fillInstance(
        modalRef,
        'Warning',
        'You have unsaved changes in your ruleset, you will loose your progress if you do not save them.',
        'Erase them',
        'Save them'
      );

      modalRef.result.then(
        (res) => {
          // Save them
          // Tries to save, if the form is valid, opens the right tab, if not shows an alert and does nothing.
          if (this.submit()) {
            this.rulesetForm = ruleset;
            this.activeRule = 0;
          } else {
            alert(
              "Unable to save your changes, there must be incorrect values in your rules or the ruleset's fields."
            );
          }
        },
        (dismiss) => {
          if (dismiss) {
            // Erase them
            // Reloads the previously saved rulesets and opens the right tab
            this.cancel(true).then((stateReloaded) => {
              if (stateReloaded) {
                const newRuleset = this.rulesetForms.find(
                  (r) => r.get('name') === ruleset.get('name')
                );
                this.rulesetForm =
                  newRuleset !== undefined ? newRuleset : this.rulesetForms[1];
                this.activeRule = 0;
              }
            });
          }
        }
      );
    } else {
      // If the user had no changes, simply opens the new tab
      this.rulesetForm = ruleset;
      this.activeRule = 0;
    }
  }

  /** Adds a new split to this form's split array. */
  public addSplit() {
    if (this.currentSplit !== '' && this.isCurrentSplitValid()) {
      (this.rulesetForm.controls['split'] as FormArray).push(
        this.fb.control(this.currentSplit)
      );
      this.currentSplit = '';
    }
  }

  /** Adds a new turn to this rule's allowed turns array. */
  public addTurn(rule: AbstractControl | null) {
    if (this.selectedTurn > 0) {
      ((rule as FormGroup).controls['allowedTurns'] as FormArray).push(
        this.fb.control(this.selectedTurn)
      );
    }
    this.selectedTurn = 0;
  }

  /** Adds a new crossing type to this rule's allowed types array. */
  public addType(rule: AbstractControl) {
    if (
      this.newCrossing.intoMA > this.newCrossing.fromMA &&
      this.newCrossing.fromMA > 0 &&
      (
        (rule as FormGroup).controls['allowedTypes'] as FormArray
      ).controls.findIndex(
        (c) =>
          (c.value as CrossingType).fromMA === this.newCrossing.fromMA &&
          (c.value as CrossingType).intoMA === this.newCrossing.intoMA
      ) === -1
    ) {
      ((rule as FormGroup).controls['allowedTypes'] as FormArray).push(
        this.fb.control(this.newCrossing)
      );
      this.newCrossing = { fromMA: 0, intoMA: 0 };
    }
  }

  /** Adds a new rule to the current ruleset form. */
  public addRule() {
    (this.rulesetForm.controls['rules'] as FormArray).push(
      this.fb.group({
        allowedTurns: this.fb.array([]),
        allowedTypes: this.fb.array([]),
        formula: ['', Validators.required],
      })
    );
  }

  /** Adds a new ruleset. */
  public addRuleset() {
    const newRuleset = this.ruleEditorService.buildForm({
      name: 'New Ruleset',
      split: [],
      rules: [{ allowedTypes: [], allowedTurns: [], formula: '' }],
    });
    this.rulesetForms.push(newRuleset);
    this.rulesetForm = newRuleset;
  }

  /** Removes the rule corresponding to the given index from the current ruleset form after user confirmation. */
  public removeRule(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    ModalUtils.fillInstance(
      modalRef,
      'Warning',
      'You are about to delete Rule n°' + (i + 1) + ', are you sure?',
      'Cancel',
      'I am sure, delete it'
    );
    modalRef.result.then(
      (res) => {
        if (res === true) {
          (this.rulesetForm.controls['rules'] as FormArray).removeAt(i);
          if ((this.rulesetForm.controls['rules'] as FormArray).length === 0) {
            this.addRule();
          }
        }
      },
      (dismiss) => {}
    );
  }

  /** Removes the given ruleset from the ruleset list after user confirmation. */
  public removeRuleset(ruleset: FormGroup) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    ModalUtils.fillInstance(
      modalRef,
      'Warning',
      'You are about to delete the ruleset named ' +
        ruleset.controls['name'].value +
        ', are you sure?',
      'Cancel',
      'I am sure, delete it'
    );
    modalRef.result.then(
      (res) => {
        if (res === true) {
          const index = this.rulesetForms.findIndex((r) => r === ruleset);
          if (index > -1) {
            if (this.rulesetForm === ruleset) {
              const newForm = this.rulesetForms.find((r) => r !== ruleset);
              this.rulesetForm =
                newForm !== undefined
                  ? newForm
                  : this.ruleEditorService.buildForm(
                      _.cloneDeep(this.emptyRuleset)
                    );
            }

            this.rulesetForms.splice(index, 1);
            if (this.rulesetForms.length === 0) {
              this.addRuleset();
            }
          }
        }
      },
      (dismiss) => {}
    );
  }

  /** Replaces all the rulesets by those that were saved previously after user confirmation. */
  public cancel(force = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!force) {
        const modalRef = this.modalService.open(ConfirmModalComponent);
        ModalUtils.fillInstance(
          modalRef,
          'Warning',
          'You are about to erase any change you might have made, are you sure?',
          'Cancel',
          'I am sure'
        );
        modalRef.result.then(
          (res) => {
            this.subs.sink = this.stateService.rulesets$
              .pipe(first())
              .subscribe((rulesets) => {
                this.updateRulesets(rulesets);
                resolve(true);
              });
          },
          (dismiss) => {
            resolve(false);
          }
        );
      } else {
        this.subs.sink = this.stateService.rulesets$
          .pipe(first())
          .subscribe((rulesets) => {
            this.updateRulesets(rulesets);
            resolve(true);
          });
      }
    });
  }

  /** Saves the rulesets if the current one is valid. (The user shouldn't be able to modify a ruleset that's not the current one, so no biggy.) */
  public submit(): boolean {
    if (this.rulesetForm.valid) {
      this.stateService.updateRulesets(this.rulesetForms.map((f) => f.value));
      return true;
    }
    return false;
  }

  /** Uses a given an array of {@link Ruleset} to build the forms. */
  private updateRulesets(rulesets: Ruleset[]) {
    if (rulesets.length > 0) {
      const sets = [];
      for (const ruleset of rulesets) {
        sets.push(this.ruleEditorService.buildForm(ruleset));
      }
      if (sets.length > 0) {
        this.rulesetForm = sets[0];
      }
      this.rulesetForms = sets;
    }
  }
}
