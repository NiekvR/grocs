import { Injectable } from '@angular/core';
import {CollectionService} from '../collection/collection.service';
import {CalendarItem} from '../../../../models/calendar.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {Menu} from '../../../../models/menu.model';
import {DateService} from '../../date/date.service';
import {MenuService} from '../menu/menu.service';
import { WeekMenu } from '../../../../models/week-menu.model';

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
    return this.getMenuByWeek(week, year);
  }

  public getMenuByWeek(week: number, year: number): Observable<Menu> {
    return this.getWeekMenuByWeek(week, year)
      .pipe(
        filter(weekMenu => !!weekMenu),
        switchMap(weekMenu => this.menuService.get(weekMenu.menu)),
        take(1));
  }

  public getWeekMenuByWeek(week: number, year: number): Observable<CalendarItem> {
    return this.db.collection<CalendarItem>('weekmenu', ref => ref
      .where('week', '==', week)
      .where('year', '==', year)).valueChanges()
      .pipe(map(weekMenus => weekMenus[ 0 ]));
  }
}
