import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GroceryService} from '../../../core/services/collections/grocery/grocery.service';
import {GroceryList} from '../../../models/grocery-list.model';
import {DateService} from '../../../core/services/date/date.service';
import {Menu, MenuMeal} from '../../../models/menu.model';
import {Meal} from '../../../models/meal.model';
import {Router} from '@angular/router';

@Component({
  selector: 'grocs-week-menu',
  templateUrl: './week-menu.component.html',
  styleUrls: ['./week-menu.component.scss']
})
export class WeekMenuComponent implements OnChanges {

  @Input() menu: Menu;
  @Input() secondary = false;
  @Input() showWeek = true;
  @Input() showDates = true;

  public currentDay: number;

  private firstDayOfWeek: Date;

  constructor(private dateService: DateService, private router: Router) {
    this.firstDayOfWeek = this.dateService.firstDayOfWeek(new Date());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.showWeek) {
      this.currentDay = this.dateService.getDay();
    }
  }

  public getDaysOfMenu(menu: { [day: number]: any }): string[] {
    return Object.keys(menu);
  }

  public getDate(days: number): string {
    return this.showDates ?
      this.dateService.format(this.dateService.addDay(this.firstDayOfWeek, days), 'dddd - D MMMM') :
      this.dateService.format(this.dateService.addDay(this.firstDayOfWeek, days), 'dddd');
  }

  public openMeal(meal: MenuMeal) {
    if (!!meal.mealId) {
      this.router.navigate(['meals', meal.mealId]);
    }
  }
 }
