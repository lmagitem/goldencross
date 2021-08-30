import { Injectable } from '@angular/core';
import { EndOfDayPrice } from 'src/app/shared/models/end-of-day-price.model';

@Injectable({
  providedIn: 'root',
})
export class MovingAverageService {
  constructor() {}

  public getMAPrice(
    onDate: Date,
    movingAverage: number,
    data: EndOfDayPrice[]
  ) {}

  public findCrossings() {}
}
