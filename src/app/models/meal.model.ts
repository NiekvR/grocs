import {Grocery} from './grocery.model';

export interface Meal {
  id?: string;
  name: string;
  description?: string;
  items?: Grocery[];
}
