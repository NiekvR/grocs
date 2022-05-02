import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { Meal } from '../../../models/meal.model';
import { SearchItem } from '../../../models/search-item.model';
import { MealService } from '../../../core/services/collections/meal/meal.service';
import { Observable, Subscription } from 'rxjs';
import { faCheckSquare, faSquare, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { CalendarItem } from '../../../models/calendar.model';
import { WeekMenuService } from '../../../core/services/collections/weekMenu/week-menu.service';
import { MenuService } from '../../../core/services/collections/menu/menu.service';
import { Menu } from '../../../models/menu.model';
import { Grocery } from '../../../models/grocery.model';
import { DateService } from '../../../core/services/date/date.service';

@Component({
  selector: 'grocs-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {
  faSquare = faSquare;
  faCheckSquare = faCheckSquare;
  faAngleLeft = faAngleLeft;

  public meals: SearchItem<Meal>[];
  public meal: Meal;
  public week: CalendarItem;
  public menu: Menu;
  public day: string;
  public showWeek = true;

  public steps = [ 1, 2, 3, 4 ];
  public stepNames = {
    1: 'Maaltijd',
    2: 'Week',
    3: 'Dag',
    4: 'Boodschappen'
  };
  public selectedStep = 1;

  @Output() addMealGroceries = new EventEmitter<Grocery[]>();

  private subscriptions: Subscription[] = [];

  constructor(private mealService: MealService, private weekMenuService: WeekMenuService, private menuService: MenuService,
              private dateService: DateService) { }

  ngOnInit() {
    this.subscriptions.push(this.getMeals());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public addMeal(meal: SearchItem<Meal>) {
    this.meal = meal;
    this.selectedStep = 2;
  }

  public selectWeek(week: CalendarItem) {
    this.week = week;
    this.selectedStep = 3;
  }

  public selectDay(day: string) {
    this.day = day;
    this.selectedStep = 4;
  }

  public updateMenuAndList() {
    if (this.meal && this.menu && this.week && this.day) {
      this.updateMenu()
        .pipe(
          tap(menu => this.week.menu = menu.id),
          switchMap(() => this.updateWeek()))
        .subscribe(() => this.addMealGroceries.emit(this.meal.items.filter(item => item.selected)));
    }
  }

  public formatWeek(week: number) {
    return this.dateService.formatWeekWithMonths(week);
  }

  public back() {
    console.log(this.showWeek);
    switch (this.selectedStep) {
      case 2: this.meal = null; break;
      case 3: this.week = this.menu = null; this.showWeek = true; break;
      case 4: this.day = null;
    }
    this.selectedStep = this.selectedStep - 1;
  }

  private getMeals(): Subscription {
    return this.mealService.getAll()
      .pipe(map(meals => meals.sort((a, b) => this.mealService.sortMeals(a, b))))
      .subscribe(meals => this.meals = this.convertToSearchItem(meals));
  }

  private convertToSearchItem(meals: Meal[]): SearchItem<Meal>[] {
    return meals.map(meal => ({
      name: meal.name,
      item: meal
    }));
  }

  private updateMenu(): Observable<Menu> {
    return !!this.menu.id ?
      this.menuService.update(this.menu).pipe(map(() => this.menu)) :
      this.menuService.add(this.menu);
  }

  private updateWeek(): Observable<CalendarItem> {
    return !!this.week.id ?
      this.weekMenuService.update(this.week).pipe(map(() => this.week)) :
      this.weekMenuService.add(this.week);
  }

}
