import {Grocery} from './grocery.model';

export interface Menu {
  id?: string;
  name: string;
  meals?: { [dayOfWeek: number ]: MenuMeal };
  groceries?: Grocery[];
}

export interface MenuMeal {
  name: string;
  mealId?: string;
}
