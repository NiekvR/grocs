import { Component, OnInit } from '@angular/core';
import { GroceryList } from '../../models/grocery-list.model';

import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Location} from '@angular/common';
import {MenuService} from '../../core/services/collections/menu/menu.service';
import {Menu} from '../../models/menu.model';

@Component({
  selector: 'grocs-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  faAngleRight = faAngleRight;

  public lists: Observable<Menu[]>;

  constructor(private router: Router, private menuService: MenuService, private location: Location) { }

  ngOnInit() {
    this.lists = this.menuService.getAll()
      .pipe(map((menus: Menu[]) => menus.sort((a, b) => a.name.localeCompare(b.name))));
  }

  public navigate(menu: Menu) {
    this.router.navigate(['menus', menu.id] );
  }

  public back() {
    this.location.back();
  }

  public createMenu() {
    this.router.navigate([ 'menus', 'create']);
  }
}
