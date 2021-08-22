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
