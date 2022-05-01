import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {GroceryList} from '../../../../models/grocery-list.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Grocery} from '../../../../models/grocery.model';
import {WeekMenu} from '../../../../models/week-menu.model';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private groceryListCollection: AngularFirestoreCollection<GroceryList>;
  private groceryCollection: AngularFirestoreCollection<Grocery>;
  private shoppingListCollection: AngularFirestoreCollection<Grocery>;

  constructor(private db: AngularFirestore) {
    this.groceryListCollection = this.db.collection<GroceryList>('list');
    this.shoppingListCollection = this.db.collection<Grocery>('shopping-list');
  }

  public addNextWeeksMenu(id: string): Observable<any> {
    const weekmenu: WeekMenu = {
      menu: id,
      week: this.getWeek() + 1,
      year: new Date().getFullYear()
    };
    return from(this.db.collection<WeekMenu>('weekmenu').add(weekmenu));
  }

  public getGroceryLists(): Observable<GroceryList[]> {
    return this.groceryListCollection.snapshotChanges().pipe(
      map(groceryLists => groceryLists.map(a => {
          const groceryList = a.payload.doc.data() as GroceryList;
          groceryList.id = a.payload.doc.id;
          return groceryList;
        }),
      map((lists: GroceryList[]) => lists.sort((a, b) => a.name > b.name ? 1 : -1))));
  }

  public getShoppingList(): Observable<Grocery[]> {
    return this.shoppingListCollection.snapshotChanges().pipe(
      map(shoppingList => shoppingList.map(a => {
          const grocery = a.payload.doc.data() as Grocery;
          grocery.id = a.payload.doc.id;
          return grocery;
        })));
  }

  public getGroceryList(id: string): Observable<GroceryList> {
    return this.groceryListCollection.doc<GroceryList>(id).get().pipe(
      map(doc => doc.data() as GroceryList)
    );
  }

  public getGroceriesForList(listId: string): Observable<Grocery[]> {
    this.groceryCollection = this.db.doc<GroceryList>(`list/${listId}`)
      .collection<Grocery>('grocery');
    return this.groceryCollection.snapshotChanges().pipe(
      map(groceries => groceries.map(a => {
          const grocery = a.payload.doc.data() as Grocery;
          grocery.id = a.payload.doc.id;
          return grocery;
        })
      ));
  }

  public addGrocery(grocery: Grocery) {
    this.groceryCollection.add(grocery)
      .then(
        (task) => {
          console.log(task);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public addGroceryToShoppingList(grocery: Grocery) {
    this.shoppingListCollection.add(grocery)
      .then(
        (task) => {
          console.log(task);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public updateGroceryOfGroceryList(grocery: Grocery): Observable<void> {
    delete grocery.edit;
    return from(this.groceryCollection.doc(grocery.id).update(grocery));
  }

  public updateGroceryOfShoppingList(grocery: Grocery): Observable<void> {
    delete grocery.edit;
    return from(this.shoppingListCollection.doc(grocery.id).update(grocery));
  }

  public deleteGroceryOfGroceryList(grocery: Grocery): Observable<void> {
    return from(this.groceryCollection.doc(grocery.id).delete());
  }

  public deleteGroceryOfShoppingList(grocery: Grocery): Observable<void> {
    return from(this.shoppingListCollection.doc(grocery.id).delete());
  }

  public updateStatusOfShoppingListItem(grocery: Grocery): Observable<void> {
    return from(this.shoppingListCollection.doc(grocery.id).update({ done: grocery.done }));
  }

  public addListToShoppingList(groceries: Grocery[]): Observable<void> {
    const batch = this.db.firestore.batch();

    groceries.forEach(grocery => {
      const newGrocery = this.db.firestore.collection('shopping-list').doc();
      grocery.date = new Date().toString();
      batch.set(newGrocery, grocery);
    });

    return from(batch.commit());
  }

  public removeGroceryFromList(groceries: Grocery[]): Observable<void> {
    const batch = this.db.firestore.batch();

    groceries.forEach(grocery => {
      const oldGrocery = this.db.firestore.collection('shopping-list').doc(grocery.id);
      batch.delete(oldGrocery);
    });

    return from(batch.commit());
  }

  private getWeek(): number {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }
}
