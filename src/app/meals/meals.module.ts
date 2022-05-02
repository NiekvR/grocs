import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealComponent } from './meal/meal.component';
import {SharedModule} from '../shared/shared.module';
import { MealListComponent } from './meal-list/meal-list.component';



@NgModule({
    declarations: [
        MealComponent,
        MealListComponent
    ],
    exports: [
        MealComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class MealsModule { }
