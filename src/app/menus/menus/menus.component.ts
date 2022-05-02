import { Component, OnDestroy, OnInit } from '@angular/core';

import {faAngleRight, faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import {Location} from '@angular/common';
import {MenuService} from '../../core/services/collections/menu/menu.service';
import {Menu} from '../../models/menu.model';

@Component({
  selector: 'grocs-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit, OnDestroy {
  faAngleRight = faAngleRight;
  faMinusCircle = faMinusCircle;

  public menus: Menu[];
  public deleteMode = false;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private menuService: MenuService, private location: Location) { }

  ngOnInit() {
    this.subscriptions.push(this.menuService.getAll()
      .pipe(map((menus: Menu[]) => menus.sort((a, b) => a.name.localeCompare(b.name))))
      .subscribe(menus => this.menus = menus));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public navigate(menu: Menu) {
    if (!this.deleteMode) {
      this.router.navigate(['menus', menu.id]);
    }
  }

  public back() {
    this.location.back();
  }

  public createMenu() {
    this.router.navigate([ 'menus', 'create']);
  }

  public deleteMenu(menu: Menu) {
    this.menuService.delete(menu).subscribe();
  }
}
