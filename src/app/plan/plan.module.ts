import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan/plan.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [PlanComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PlanModule { }
