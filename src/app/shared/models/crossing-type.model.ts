/** Contains a pair of MA types that run into each other. */
export interface CrossingType {
  fromMA: number;
  intoMA: number;
}

/** Default values for crossing types. */
export const initialCrossingTypes: CrossingType[] = [
  { fromMA: 15, intoMA: 30 },
  { fromMA: 30, intoMA: 50 },
  { fromMA: 50, intoMA: 100 },
  { fromMA: 50, intoMA: 200 },
  { fromMA: 100, intoMA: 200 },
];
