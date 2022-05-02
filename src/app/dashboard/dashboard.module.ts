import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import {GroceryService} from '../core/services/collections/grocery/grocery.service';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AddMealComponent } from './shopping-list/add-meal/add-meal.component';
import { MealsModule } from '../meals/meals.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ShoppingListComponent,
    AddMealComponent
  ],
    imports: [
        SharedModule,
        MealsModule
    ],
  providers: [ GroceryService ]
})
export class DashboardModule { }
