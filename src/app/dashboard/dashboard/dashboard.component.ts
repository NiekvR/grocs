import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {faToggleOn, faToggleOff} from '@fortawesome/free-solid-svg-icons';
import {WeekMenuService} from '../../core/services/collections/weekMenu/week-menu.service';
import {Menu} from '../../models/menu.model';

@Component({
  selector: 'grocs-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;

  public menu: Menu;
  public showWeek = true;

  constructor(private router: Router, private weekMenuService: WeekMenuService) { }

  ngOnInit() {
    this.getWeekMenu();
  }

  public openShoppingList() {
    this.router.navigate(['shopping-list']);
  }

  private getWeekMenu() {
    this.weekMenuService.getCurrentMenu()
      .subscribe(menu => this.menu = menu);
  }

}
