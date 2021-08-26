/** Contains a pair of MA types that run into each other. */
export interface CrossingType {
  firstMA: number;
  intoMA: number;
}

/** Default values for crossing types. */
export const initialCrossingTypes: CrossingType[] = [
  { firstMA: 15, intoMA: 30 },
  { firstMA: 30, intoMA: 50 },
  { firstMA: 50, intoMA: 100 },
  { firstMA: 50, intoMA: 200 },
  { firstMA: 100, intoMA: 200 },
];
