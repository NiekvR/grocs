import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class LoginModule { }
