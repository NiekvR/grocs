import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateService} from './services/date/date.service';
import {GroceryService} from './services/collections/grocery/grocery.service';
import {CollectionService} from './services/collections/collection/collection.service';
import {MealService} from './services/collections/meal/meal.service';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
  providers: [
    DateService,
    CollectionService,
    GroceryService,
    MealService
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class CoreModule { }
