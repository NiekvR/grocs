import {Component, OnInit} from '@angular/core';
import {DateService} from '../../core/services/date/date.service';
import {CalendarItem, CalenderType} from '../../models/calendar.model';
import {MenuService} from '../../core/services/collections/menu/menu.service';
import {WeekMenuService} from '../../core/services/collections/weekMenu/week-menu.service';
import {map, tap} from 'rxjs/operators';
import {Menu} from '../../models/menu.model';
import {SearchItem} from '../../models/search-item.model';
import {Location} from '@angular/common';

@Component({
  selector: 'grocs-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  CalendarType = CalenderType;

  public calendar: CalendarItem[];
  public menus: Menu[];
  public searchItems: SearchItem<Menu>[];
  public selectedWeek: CalendarItem;

  constructor(private dateService: DateService, private weekMenuService: WeekMenuService, private menuService: MenuService,
              private location: Location) { }

  ngOnInit() {
    this.getCalendar();
    this.getMenus();
  }

  public getFormatedLabel(item: CalendarItem) {
    return item.type === CalenderType.YEAR ?
      item.year :
      this.dateService.formatMonth(item.month);
  }

  public getFormattedWeek(item: CalendarItem) {
    return this.dateService.formatWeek(item.week);
  }

  public getMenu(id: string): Menu {
    return this.menus.find(menu => menu.id === id);
  }

  public selectMenu(item: CalendarItem) {
    this.selectedWeek = item;
  }

  public addMenu(menu: Menu) {
    const hasSelected = !!this.selectedWeek.menu;
    this.selectedWeek.menu = menu.id;

    const save = hasSelected ?
      this.weekMenuService.update(this.selectedWeek) :
      this.weekMenuService.add(this.selectedWeek);

    // @ts-ignore
    save.subscribe(() => {
      this.selectedWeek = null;
    });
  }

  public back() {
    this.location.back();
  }

  private getMenus() {
    this.menuService.getAll()
      .pipe(
        map(menus => this.menus = menus),
        map(menus => this.convertToSearchItems(menus)))
      .subscribe(menus => this.searchItems = menus);
  }

  private getCalendar() {
    this.weekMenuService.getAll()
      .pipe(map(weekMenu => this.mapWeekMenuOnWeeks(weekMenu)))
      .subscribe(weekMenu => this.calendar = weekMenu);
  }

  private mapWeekMenuOnWeeks(weekMenus: CalendarItem[]) {
    const calendar = this.dateService.getYear();

    weekMenus.forEach(weekMenu => {
      const week = calendar.find(item => item.year === weekMenu.year && item.week === weekMenu.week);
      if (!!week) {
        week.id = weekMenu.id;
        week.menu = weekMenu.menu;
      }
    });

    return calendar;
  }

  private convertToSearchItems(menus: Menu[]): SearchItem<Menu>[] {
    return menus.map(menu => this.convertToSearchItem(menu));
  }

  private convertToSearchItem(menu: Menu): SearchItem<Menu> {
    return {
      name: menu.name,
      item: menu
    };
  }
}
