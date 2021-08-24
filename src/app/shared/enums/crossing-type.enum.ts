/** Which moving averages cross one into another. */
export enum CrossingType {
  AB = '13->30',
  AC = '13->50',
  AD = '13->100',
  AE = '13->150',
  BC = '30->50',
  BD = '30->100',
  CD = '50->100',
  DE = '100->150',
  DF = '100->200',
}

/** List of the moving average crossings. */
export const crossingTypeList = [
  CrossingType.AB,
  CrossingType.AC,
  CrossingType.AD,
  CrossingType.AE,
  CrossingType.BC,
  CrossingType.BD,
  CrossingType.CD,
  CrossingType.DE,
  CrossingType.DF,
];
