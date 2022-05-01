import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {CollectionService} from '../collection/collection.service';
import {Meal} from '../../../../models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealService extends CollectionService<Meal> {

  constructor(private db: AngularFirestore) {
    super();
    this.collection = this.db.collection<Meal>('meals');
  }

  public sortMeals(a: Meal, b: Meal): number {
    return a.name.localeCompare(b.name);
  }
}
