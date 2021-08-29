import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/** Helper functions for anything modal related. */
export class ModalUtils {
  /** Fills the given modal attributes using what was given in parameter. */
  public static fillInstance(
    modalRef: NgbModalRef,
    title: string,
    content: string,
    cancellationLabel: string,
    validationLabel: string
  ) {
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.cancellationLabel = cancellationLabel;
    modalRef.componentInstance.validationLabel = validationLabel;
  }
}
