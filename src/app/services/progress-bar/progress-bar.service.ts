import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ProgressBarContent } from 'src/app/shared/models/progress-bar-content';

/** A simple service to manage what the progress bar should display. */
@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  private readonly EMPTY_PROGRESS_BAR: ProgressBarContent = {
    animated: false,
    value: 100,
    striped: false,
    type: 'dark',
    text: '',
  };
  /** Do I have to reset the progress bar after 5 seconds? */
  private resetNecessary = false;

  /** The necessary content to display a progress bar. */
  private content = new BehaviorSubject<ProgressBarContent>(
    _.cloneDeep(this.EMPTY_PROGRESS_BAR)
  );
  /** The stocks filled with data that serve as rows. */
  public content$ = this.content.asObservable();

  /** Updates the content of the progress bar. */
  public update(
    text: string,
    value: number,
    type:
      | 'primary'
      | 'secondary'
      | 'dark'
      | 'success'
      | 'info'
      | 'warning'
      | 'danger' = 'info',
    striped = true,
    animated = true,
    error = false
  ) {
    this.resetNecessary = false;
    this.content.next({ text, value, type, striped, animated });

    if (error) {
      this.resetNecessary = true;
      setTimeout(() => {
        if (this.resetNecessary) {
          this.content.next(_.cloneDeep(this.EMPTY_PROGRESS_BAR));
        }
      }, 5000);
    }
  }
}
