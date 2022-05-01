import {Component, Input, OnInit} from '@angular/core';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

@Component({
  selector: 'grocs-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  faEllipsisV = faEllipsisV;

  public active = false;

  public openMenus = {
    groceries: false,
    meals: false,
    menus: false
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public openSubNavigation(menuItem: string) {
    this.openMenus[ menuItem ] = !this.openMenus[ menuItem ];
  }

  public goToMeals() {
    this.router.navigate(['meals']);
  }

  public goToCreateMeal() {
    this.router.navigate(['meals', 'create']);
  }

  public goToMenus() {
    this.router.navigate(['menus']);
  }

  public goToCreateMenu() {
    this.router.navigate(['menus', 'create']);
  }

  public goToPlan() {
    this.router.navigate(['plan']);
  }
}
