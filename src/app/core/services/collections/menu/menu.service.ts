import { Injectable } from '@angular/core';
import {CollectionService} from '../collection/collection.service';
import {Menu} from '../../../../models/menu.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CollectionService<Menu> {

  constructor(private db: AngularFirestore) {
    super();
    this.collection = this.db.collection<Menu>('menus');
  }
}
