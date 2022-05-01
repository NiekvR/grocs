import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { HeaderComponent } from './components/header/header.component';
import { ToastrModule } from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import {AddGroceryComponent} from './components/add-grocery/add-grocery.component';
import {WeekMenuComponent} from './components/week-menu/week-menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    AddGroceryComponent,
    WeekMenuComponent,
    ModalComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AngularFirestoreModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    AngularFirestoreModule,
    HeaderComponent,
    ToastrModule,
    ReactiveFormsModule,
    MenuComponent,
    FormsModule,
    AddGroceryComponent,
    WeekMenuComponent,
    ModalComponent,
    SearchComponent
  ]
})
export class SharedModule { }
