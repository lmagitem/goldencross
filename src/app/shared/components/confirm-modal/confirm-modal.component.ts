import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/** A modal that gives the user a YES/NO type of choice. */
@Component({
  selector: 'shared-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  /** The modal's title. */
  title: string = 'Modal';
  /** The modal's content. */
  content: string = 'Content';
  /** The text to display for the NO button. */
  cancellationLabel: string = 'Cancel';
  /** The text to display for the YES button. */
  validationLabel: string = 'OK';

  constructor(public modal: NgbActiveModal) {}
}
