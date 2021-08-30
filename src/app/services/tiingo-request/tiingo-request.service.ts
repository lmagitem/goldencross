import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateService } from '../state/state.service';
import { SubSink } from 'subsink';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { TickerInfos } from 'src/app/shared/models/ticker-infos.model';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';
import { Stock } from 'src/app/shared/models/stock.model';

/** Retreives market data from Tiingo. */
@Injectable({
  providedIn: 'root',
})
export class TiingoRequestService implements OnDestroy {
  /** Subscription management. */
  private subs: SubSink = new SubSink();
  /** The API token used to retreive data from Tiingo. */
  private token = '';

  constructor(private http: HttpClient, private stateService: StateService) {
    this.subs.sink = this.stateService.apiToken$.subscribe(
      (token) => (this.token = token)
    );
  }

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Returns general infos about a given ticker and its available data on Tiingo. */
  getInfos(stock: Stock): Observable<HttpResponse<TickerInfos>> {
    console.log('Trying to get general infos about ' + stock.name + '.');

    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );
    return this.http.get<TickerInfos>(
      this.buildTiingoUrl('tiingo/daily/' + stock.ticker),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }

  /** Returns a list of historical prices for a given ticker during a given period. */
  getHistoricalPrices(
    stock: Stock,
    startDate: Date,
    endDate?: Date
  ): Observable<HttpResponse<EndOfDayPrice[]>> {
    console.log(
      'Trying to get historical prices for ' +
        stock.name +
        (!!endDate
          ? ' between ' +
            startDate.toUTCString() +
            ' and ' +
            endDate.toUTCString() +
            '.'
          : ' since ' + startDate.toUTCString() + '.')
    );

    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );
    return this.http.get<EndOfDayPrice[]>(
      this.buildTiingoUrl(
        `tiingo/daily/` +
          stock.ticker +
          `/prices?startDate=${startDate.getFullYear()}-${
            startDate.getMonth() + 1
          }-${startDate.getDate()}` +
          (endDate !== undefined
            ? `&endDate=${endDate.getFullYear()}-${
                endDate.getMonth() + 1
              }-${endDate.getDate()}`
            : '')
      ),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }

  /** Returns a URL with Tiingo's domain and the user's token. */
  private buildTiingoUrl(path: string): string {
    return `https://api.tiingo.com/${path}${
      StringUtils.findMatches(/\?/, path).length > 0 ? '&' : '?'
    }token=${this.token}`;
  }
}
