import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Menu, MenuMeal} from '../../../models/menu.model';
import {DateService} from '../../../core/services/date/date.service';
import {MealService} from '../../../core/services/collections/meal/meal.service';
import {Meal} from '../../../models/meal.model';
import {map} from 'rxjs/operators';
import {SearchItem} from '../../../models/search-item.model';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'grocs-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss']
})
export class CreateMenuComponent implements OnInit {
  faTimes = faTimes;

  @Input() menu: Menu;
  @Output() menuChange = new EventEmitter<Menu>();
  @Output() addMealChange = new EventEmitter<{ [dayOfWeek: number ]: Meal }>();
  @Output() removeMealChange = new EventEmitter<number>();

  public openModal = false;
  public newMenu: Menu;

  public meals: SearchItem<Meal>[];

  private firstDayOfWeek: Date;
  private day: number;

  constructor(private dateService: DateService, private mealService: MealService) {
    this.firstDayOfWeek = this.dateService.firstDayOfWeek(new Date());
  }

  ngOnInit() {
    this.createMenu(this.menu);
    this.getMeals();
  }

  public getDaysOfMenu(menu: { [day: number]: MenuMeal }): string[] {
    return Object.keys(menu);
  }

  public getDate(days: number): string {
    return this.dateService.format(this.dateService.addDay(this.firstDayOfWeek, days), 'dddd');
  }

  public openSearch(day: number) {
    this.day = day;
    this.openModal = true;
  }

  public addMeal(meal: Meal) {
    this.newMenu.meals[this.day].name = meal.name;
    this.newMenu.meals[this.day].mealId = meal.id;
    this.openModal = false;
    this.menuChange.emit(this.newMenu);
    this.addMealChange.emit({ [ this.day ]: meal });
  }

  public removeMeal(day: number) {
    this.newMenu.meals[day].name = null;
    delete this.newMenu.meals[day].mealId;
    this.menuChange.emit(this.newMenu);
    this.removeMealChange.emit(day);
  }

  private createMenu(menu?: Menu) {
    this.newMenu = {
      name: '',
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
    if (!!menu) {
      this.newMenu.name = menu.name;
      this.newMenu.meals = { ...this.newMenu.meals, ...menu.meals };
    }

    this.menuChange.emit(this.newMenu);
  }

  private getMeals() {
    this.mealService.getAll()
      .pipe(map(meals => meals.sort((a, b) => this.mealService.sortMeals(a, b))))
      .subscribe(meals => this.meals = this.convertToSearchItem(meals));
  }

  private convertToSearchItem(meals: Meal[]): SearchItem<Meal>[] {
    return meals.map(meal => ({
      name: meal.name,
      item: meal
    }));
  }
}
