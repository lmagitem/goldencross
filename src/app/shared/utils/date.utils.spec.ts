import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  let sortedEndOfDayPrices: any[] = [];
  let endOfDayPrices: any[] = [];
  let sortedCustomFieldObjects: any[] = [];
  let customFieldObjects: any[] = [];

  beforeEach(() => {
    sortedEndOfDayPrices = [
      {
        date: new Date('2019-01-02T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-03T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-04T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-05T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-06T00:00:00.000Z'),
      },
    ];
    endOfDayPrices = [
      {
        date: new Date('2019-01-06T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-03T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-04T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-02T00:00:00.000Z'),
      },
      {
        date: new Date('2019-01-05T00:00:00.000Z'),
      },
    ];
    sortedCustomFieldObjects = [
      {
        start: new Date('2019-01-02T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-03T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-04T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-05T00:00:00.000Z'),
      },
    ];
    customFieldObjects = [
      {
        start: new Date('2019-01-05T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-03T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-04T00:00:00.000Z'),
      },
      {
        start: new Date('2019-01-02T00:00:00.000Z'),
      },
    ];
  });

  it(`.deltaDateWithTradingDays should return a date with the proper offset`, () => {
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          0,
          3
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-01-09T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          0,
          -3
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-01-01T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-03-01T00:00:00.000Z'),
          0,
          0,
          -1
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-02-28T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-03-30T00:00:00.000Z'),
          0,
          0,
          -30
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-02-15T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          2,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-03-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-05-05T00:00:00.000Z'),
          0,
          -3,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2019-02-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T23:00:00.000Z'),
          0,
          -3,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2018-10-05T23:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          -3,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2018-10-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          -3,
          5
        )
      )
    ).toEqual(JSON.stringify(new Date('2018-10-12T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          0,
          13,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2020-02-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDateWithTradingDays(
          new Date('2019-01-05T00:00:00.000Z'),
          2,
          0,
          0
        )
      )
    ).toEqual(JSON.stringify(new Date('2021-01-05T00:00:00.000Z')));
  });

  it(`.deltaDate should return a date with the proper offset`, () => {
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, 0, 3)
      )
    ).toEqual(JSON.stringify(new Date('2019-01-08T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, 0, -3)
      )
    ).toEqual(JSON.stringify(new Date('2019-01-02T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-03-01T00:00:00.000Z'), 0, 0, -1)
      )
    ).toEqual(JSON.stringify(new Date('2019-02-28T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-03-30T00:00:00.000Z'), 0, 0, -30)
      )
    ).toEqual(JSON.stringify(new Date('2019-02-28T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, 2, 0)
      )
    ).toEqual(JSON.stringify(new Date('2019-03-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-05-05T00:00:00.000Z'), 0, -3, 0)
      )
    ).toEqual(JSON.stringify(new Date('2019-02-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T23:00:00.000Z'), 0, -3, 0)
      )
    ).toEqual(JSON.stringify(new Date('2018-10-05T23:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, -3, 0)
      )
    ).toEqual(JSON.stringify(new Date('2018-10-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, -3, 5)
      )
    ).toEqual(JSON.stringify(new Date('2018-10-10T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 0, 13, 0)
      )
    ).toEqual(JSON.stringify(new Date('2020-02-05T00:00:00.000Z')));
    expect(
      JSON.stringify(
        DateUtils.deltaDate(new Date('2019-01-05T00:00:00.000Z'), 2, 0, 0)
      )
    ).toEqual(JSON.stringify(new Date('2021-01-05T00:00:00.000Z')));
  });

  it(`.sortByDate should return an array properly sorted`, () => {
    expect(JSON.stringify(DateUtils.sortByDate(endOfDayPrices))).toEqual(
      JSON.stringify(sortedEndOfDayPrices)
    );
    expect(
      JSON.stringify(DateUtils.sortByDate(customFieldObjects, 'start'))
    ).toEqual(JSON.stringify(sortedCustomFieldObjects));
  });

  it(`.findIndexAtDate should return the index of the element with the same date as the given one`, () => {
    expect(
      DateUtils.findIndexAtDate(
        sortedEndOfDayPrices,
        new Date('2019-01-05T00:00:00.000Z')
      )
    ).toEqual(3);
    expect(
      DateUtils.findIndexAtDate(
        sortedEndOfDayPrices,
        new Date('2019-01-04T18:24:50.000Z')
      )
    ).toEqual(2);
    expect(
      DateUtils.findIndexAtDate(
        sortedEndOfDayPrices,
        new Date('2019-01-24T00:00:00.000Z')
      )
    ).toEqual(-1);
    expect(
      DateUtils.findIndexAtDate(
        sortedCustomFieldObjects,
        new Date('2019-01-05T00:00:00.000Z'),
        'start'
      )
    ).toEqual(3);
    expect(
      DateUtils.findIndexAtDate(
        sortedCustomFieldObjects,
        new Date('2019-01-04T18:24:50.000Z'),
        'start'
      )
    ).toEqual(2);
    expect(
      DateUtils.findIndexAtDate(
        sortedCustomFieldObjects,
        new Date('2019-01-24T00:00:00.000Z'),
        'start'
      )
    ).toEqual(-1);
  });
});
