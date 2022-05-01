import { Injectable } from '@angular/core';
import {CollectionService} from '../collection/collection.service';
import {CalendarItem} from '../../../../models/calendar.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {filter, switchMap, take} from 'rxjs/operators';
import {Menu} from '../../../../models/menu.model';
import {DateService} from '../../date/date.service';
import {MenuService} from '../menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class WeekMenuService extends CollectionService<CalendarItem> {

  constructor(private db: AngularFirestore, private dateService: DateService, private menuService: MenuService) {
    super();
    this.collection = this.db.collection<CalendarItem>('weekmenu');
  }

  public getCurrentMenu(): Observable<Menu> {
    const week = this.dateService.getWeek();
    const year = new Date().getFullYear();
    return this.db.collection<CalendarItem>('weekmenu', ref => ref
      .where('week', '==', week)
      .where('year', '==', year)).valueChanges()
      .pipe(
        filter(weekMenus => !!weekMenus),
        switchMap(weekMenus => this.menuService.get(weekMenus[0].menu)),
        take(1));
  }
}
