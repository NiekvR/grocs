import {Component, OnDestroy, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {Grocery} from '../../../models/grocery.model';
import {
  faAngleLeft,
  faCheckCircle,
  faCheckSquare,
  faFileImport,
  faMinusCircle,
  faNotesMedical,
  faSquare
} from '@fortawesome/free-solid-svg-icons';
import {of, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GroceryService} from '../../../core/services/collections/grocery/grocery.service';
import {GroceryList} from '../../../models/grocery-list.model';
import { ToastrService } from 'ngx-toastr';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'grocs-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent implements OnInit, OnDestroy {
  faSquare = faSquare;
  faCheckSquare = faCheckSquare;
  faNotesMedical = faNotesMedical;
  faFileImport = faFileImport;
  faAngleLeft = faAngleLeft;
  faMinusCircle = faMinusCircle;
  faCheckCircle = faCheckCircle;

  public listId: string;
  public groceryList: GroceryList;
  public groceries: Grocery[];
  public selectMenu = false;

  public selecting = false;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private groceryService: GroceryService,
              private toastrService: ToastrService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.listId = this.route.snapshot.params.id;
    this.subscriptions.push(this.getGrocertListBasedOnRoute());
    this.subscriptions.push(this.getGroceriesBasedOnRoute());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public updateGroceryItem(grocery: Grocery) {
    this.groceryService.updateGroceryOfGroceryList(grocery);
  }

  public deleteGroceryItem(grocery: Grocery) {
    this.groceryService.deleteGroceryOfGroceryList(grocery);
  }

  public addGrocery(grocery: Grocery) {
    this.groceryService.addGrocery(grocery);
  }

  public sendToList() {
    if (this.selecting) {
      const shoppingList = this.groceries.filter(grocery => grocery.selected);
      this.groceryService.addListToShoppingList(shoppingList)
        .pipe(
          switchMap(() => this.groceryList.name !== 'Overig' ? this.groceryService.addNextWeeksMenu(this.listId) : of({})))
        .subscribe(() => {
        this.toastrService.success('Boodschappen toegevoegd aan de boodschappenlijst.');
        this.navigateToDashboard();
      });
    }
    this.selecting = !this.selecting;
  }

  public navigateToDashboard() {
    this.router.navigate(['/']);
  }

  public back() {
    this.location.back();
  }

  private getGrocertListBasedOnRoute() {
    return this.groceryService.getGroceryList(this.listId)
      .pipe(tap(groceryList => this.selectMenu = groceryList.name === 'Overig'))
      .subscribe(groceryList => this.groceryList = groceryList);
  }

  private getGroceriesBasedOnRoute(): Subscription {
    return this.groceryService.getGroceriesForList(this.listId)
      .subscribe(groceries => this.groceries = groceries.sort((a, b) => a.name.localeCompare(b.name)));
  }

}
