import * as moment from 'moment';

/** Helper functions for anything date related. */
export class DateUtils {
  /** The amount of milliseconds in a day. */
  public static MILLISECONDS_IN_A_DAY = 86400000;

  /** Returns a date calculated by adding/subtracting the given amount of y(ears), m(onths) and d(days) to it,
   *  the d(ays) are transformed in trading days before calculation.  */
  public static deltaDateWithTradingDays(
    date: Date,
    y: number,
    m: number,
    d: number
  ): Date {
    // Take into account that we want trading days
    d = d * (365.25 / (365.25 * (5 / 7) - 6 - (3 * 5) / 7));
    return this.deltaDate(date, y, m, d);
  }

  /** Returns a date calculated by adding/subtracting the given amount of y(ears), m(onths) and d(days) to it. */
  public static deltaDate(input: Date, y: number, m: number, d: number): Date {
    return moment.utc(input).add({ days: d, months: m, years: y }).toDate();
  }

  /** Sorts the given array of objects by a date contained in its fields. */
  public static sortByDate(array: any[] = [], field = 'date'): any[] {
    array.sort(
      (a, b) => new Date(a[field]).getTime() - new Date(b[field]).getTime()
    );
    return array;
  }

  /** Finds the index of the object which has a date field whose content equals the given date. */
  public static findIndexAtDate(array: any[], onDate: Date, field = 'date') {
    onDate = new Date(onDate);
    return array.findIndex((p) => {
      const date = new Date(p[field]);
      return (
        date.getFullYear() === onDate.getFullYear() &&
        date.getMonth() === onDate.getMonth() &&
        date.getDate() === onDate.getDate()
      );
    });
  }
}
