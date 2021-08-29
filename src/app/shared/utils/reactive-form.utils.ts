import { FormArray } from '@angular/forms';

/** Helper functions for anything ReactiveForm related. */
export class ReactiveFormUtils {
  /** Removes in the given {@link FormArray} the entry containing what cannot be found into the array of values. */
  public static onlyKeepCorrespondingValues(array: FormArray, values: any[]) {
    array.removeAt(
      array.value.findIndex(
        (a: number) => values.findIndex((v) => v === a) === -1
      )
    );
  }
}
