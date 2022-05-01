import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {MenusComponent} from './menus/menus.component';
import {GroceryListComponent} from './menus/grocery-list/grocery-list.component';
import {SharedModule} from '../shared/shared.module';
import { CreateMenuComponent } from './menu/create-menu/create-menu.component';



@NgModule({
  declarations: [
    MenusComponent,
    MenuComponent,
    GroceryListComponent,
    CreateMenuComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class MenusModule { }
