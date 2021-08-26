import { CrossingType } from './crossing-type.model';

/** Represents a dynamically generated column for the crossings. */
export interface DataEntryColumn {
  index: number;
  name: string;
  type: CrossingType;
  visible: boolean;
}
