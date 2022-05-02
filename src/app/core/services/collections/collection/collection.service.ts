import { Injectable } from '@angular/core';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollectionService<T> {
  protected collection: AngularFirestoreCollection<T>;

  constructor() {
  }

  public get(id: string): Observable<T> {
    return this.collection.doc<T>(id).get().pipe(
      map(doc => {
        const item = doc.data() as T;
        (item as any).id = doc.id;
        return item;
      })
    );
  }

  public getAll(): Observable<T[]> {
    return this.collection.snapshotChanges().pipe(
      map(list => list.map(a => {
          const item = a.payload.doc.data() as T;
          (item as any).id = a.payload.doc.id;
          return item;
        })));
  }

  public add(item: T): Observable<T> {
    delete (item as any).id;
    return from(this.collection.add(item)).pipe(switchMap(document => from(document.get()).pipe(
      map(doc => {
        const updatedItem = doc.data() as T;
        (updatedItem as any).id = doc.id;
        return updatedItem;
      })
    )));
  }

  public update(item: T): Observable<void> {
    return from(this.collection.doc((item as any).id).update(item));
  }

  public delete(item: T): Observable<void> {
    return from(this.collection.doc((item as any).id).delete());
  }
}
