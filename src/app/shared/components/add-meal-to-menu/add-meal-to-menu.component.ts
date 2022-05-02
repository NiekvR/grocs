import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateService } from '../../../core/services/date/date.service';
import { CalendarItem, CalenderType } from '../../../models/calendar.model';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { WeekMenuService } from '../../../core/services/collections/weekMenu/week-menu.service';
import { MenuService } from '../../../core/services/collections/menu/menu.service';
import { Menu, MenuMeal } from '../../../models/menu.model';
import { Meal } from '../../../models/meal.model';

@Component({
  selector: 'grocs-add-meal-to-menu',
  templateUrl: './add-meal-to-menu.component.html',
  styleUrls: ['./add-meal-to-menu.component.scss']
})
export class AddMealToMenuComponent implements OnInit {
  CalendarType = CalenderType;

  @Input() showWeek = true;
  @Input() menu: Menu;
  public weeks: CalendarItem[];

  private firstDayOfWeek: Date;

  @Input() meal: Meal;
  @Output() selectedWeek = new EventEmitter<CalendarItem>();
  @Output() menuChange = new EventEmitter<Menu>();
  @Output() updatedDay = new EventEmitter<string>();
  @Output() showWeekChange = new EventEmitter<boolean>();

  constructor(private dateService: DateService, private weekMenuService: WeekMenuService, private menuService: MenuService) {
    this.firstDayOfWeek = this.dateService.firstDayOfWeek(new Date());
  }

  ngOnInit() {
    this.weeks = this.dateService.getYear();
  }

  public getFormatedLabel(item: CalendarItem) {
    return item.type === CalenderType.YEAR ?
      item.year :
      this.dateService.formatMonth(item.month);
  }

  public getFormattedWeek(item: CalendarItem) {
    return this.dateService.formatWeek(item.week);
  }

  public selectWeek(item: CalendarItem) {
    this.selectedWeek.emit(item);
    this.getWeekMenu(item);
  }

  public getWeekMenu(item: CalendarItem) {
    this.weekMenuService.getWeekMenuByWeek(item.week, item.year)
      .pipe(switchMap(weekMenu => !!weekMenu ?
        this.menuService.get(weekMenu.menu).pipe(take(1)) :
        of(this.createMenu(item.week, item.year))))
      .subscribe(menu => {
        this.menu = menu;
        this.showWeek = false;
        this.showWeekChange.emit(false);
      });
  }

  public getDaysOfMenu(menu: { [day: number]: MenuMeal }): string[] {
    return Object.keys(menu);
  }

  public getDate(days: number): string {
    return this.dateService.format(this.dateService.addDay(this.firstDayOfWeek, days), 'dddd');
  }

  public getDateOfMonth(days: number): string {
    return this.dateService.format(this.dateService.addDay(this.firstDayOfWeek, days), 'ddd D MMM');
  }

  public addMealToMenu(day: number) {
    this.menu.meals[day].name = this.meal.name;
    this.menu.meals[day].mealId = this.meal.id;
    this.updatedDay.emit(this.getDateOfMonth(day));
    this.menuChange.emit(this.menu);
  }

  private createMenu(week: number, year: number): Menu {
    return {
      name: `Week ${week}, ${year}`,
      meals: {
        0: {
          name: null
        },
        1: {
          name: null
        },
        2: {
          name: null
        },
        3: {
          name: null
        },
        4: {
          name: null
        },
        5: {
          name: null
        },
        6: {
          name: null
        }
      }
    };
  }

}
