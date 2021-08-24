import { CrossingType } from '../shared/enums/crossing-type.enum';

/** Represents a dynamically generated column. */
export interface DataEntryColumn {
  index: number;
  name: string;
  type: CrossingType;
}
