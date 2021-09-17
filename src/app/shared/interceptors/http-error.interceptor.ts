import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarService } from 'src/app/services/progress-bar/progress-bar.service';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { ModalUtils } from '../utils/modal.utils';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private modalService: NgbModal,
    private progressBarService: ProgressBarService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          let modalRef;
          switch (error.status) {
            case 0:
              modalRef = this.modalService.open(ConfirmModalComponent);
              ModalUtils.fillInstance(
                modalRef,
                'Error',
                "It seems that your browser CORS filter is activated, which prevents the application to send requests to Tiingo. Please install an extension to deactivate your browser's CORS filter and ensure that the extension is active."
              );
              modalRef.result.then(
                (res) => {},
                (dismiss) => {}
              );
              this.progressBarService.update(
                `Couldn't reach Tiingo.`,
                100,
                'danger',
                true,
                true,
                true
              );
              break;
            case 401:
              modalRef = this.modalService.open(ConfirmModalComponent);
              ModalUtils.fillInstance(
                modalRef,
                'Error',
                "The Tiingo API token you provided doesn't seem to work, please make sure it is valid."
              );
              modalRef.result.then(
                (res) => {},
                (dismiss) => {}
              );
              this.progressBarService.update(
                `Couldn't get a valid response from Tiingo.`,
                100,
                'danger',
                true,
                true,
                true
              );
              break;
            case 404:
              modalRef = this.modalService.open(ConfirmModalComponent);
              ModalUtils.fillInstance(
                modalRef,
                'Error',
                "An error has occured. If you are trying to add a stock, it is probable that the ticker you provided isn't present in Tiingo's database (or you misspelled it), which provides \"coverage of over 65,000 Equities, Mutual Funds, and ETFs, the Tiingo database gives you access to one of the most expansive data sets available for US & Chinese markets\". If you aren't trying to add a stock, either Tiingo's API server is currently unavailable or the request parameters that has been sent to it aren't valid."
              );
              modalRef.result.then(
                (res) => {},
                (dismiss) => {}
              );
              this.progressBarService.update(
                `Requested data not found.`,
                100,
                'danger',
                true,
                true,
                true
              );
              break;
            default:
              break;
          }
        }
        console.error(error);
        return throwError(error.message);
      })
    );
  }
}
