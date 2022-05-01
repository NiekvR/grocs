import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MealService} from '../../core/services/collections/meal/meal.service';
import {Meal} from '../../models/meal.model';

@Component({
  selector: 'grocs-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.scss']
})
export class MealListComponent implements OnInit, OnDestroy {

  public meals: Meal[];

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private mealService: MealService) { }

  ngOnInit() {
    this.subscriptions.push(this.getMeals());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public back() {
    this.router.navigate([ '/' ]);
  }

  public mealDetail(id: string) {
    this.router.navigate([ 'meals',  id ]);
  }

  public addMeal() {
    this.router.navigate([ 'meals', 'create' ]);
  }

  private getMeals() {
    return this.mealService.getAll()
      .subscribe(meals => this.meals = meals);
  }

}
