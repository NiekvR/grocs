import {Component, OnDestroy, OnInit} from '@angular/core';
import {Grocery} from '../../models/grocery.model';
import {GroceryService} from '../../core/services/collections/grocery/grocery.service';
import {Subscription} from 'rxjs';
import {faAngleLeft, faBan, faCheckCircle, faCheckSquare, faMinusCircle, faSquare, faUtensils} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';

@Component({
  selector: 'grocs-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  faSquare = faSquare;
  faCheckSquare = faCheckSquare;
  faAngleLeft = faAngleLeft;
  faBan = faBan;
  faMinusCircle = faMinusCircle;
  faCheckCircle = faCheckCircle;
  faUtensils = faUtensils;

  public groceries: Grocery[];
  public groceriesDone: Grocery[];

  public showDone = false;
  public openMealSelector = false;

  private subscriptions: Subscription[] = [];

  constructor(private groceryService: GroceryService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.subscriptions.push(this.getShoppingList());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public updateGroceryItem(grocery: Grocery) {
    this.groceryService.updateGroceryOfShoppingList(grocery);
  }

  public deleteGroceryItem(grocery: Grocery) {
    this.groceryService.deleteGroceryOfShoppingList(grocery);
  }

  public updateGroceryItemStatus(grocery: Grocery) {
    grocery.done = !grocery.done;
    this.groceryService.updateStatusOfShoppingListItem(grocery)
      .subscribe(
        () => {},
        err => this.toastrService.error(err, 'Offline')
      );
  }

  public navigateToDashboard() {
    this.router.navigate(['/']);
  }

  public addGroceryToShoppingList(grocery: Grocery) {
    this.groceryService.addGroceryToShoppingList(grocery);
  }

  public addGroceriesToShoppingList(groceries: Grocery[]) {
    this.groceryService.addListToShoppingList(groceries).subscribe(() => this.openMealSelector = false);
  }

  public removeDoneItems() {
    this.toastrService.info('Weet je zeker dat je de boodschappen geschiedenis wilt verwijderen?', null, { closeButton: true })
      .onTap
      .pipe(take(1))
      .subscribe(() => this.groceryService.removeGroceryFromList(this.groceriesDone));
  }

  private getShoppingList(): Subscription {
    return this.groceryService.getShoppingList().subscribe(shoppingList => {
      this.groceries = shoppingList.filter(grocery => !grocery.done).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.groceriesDone = shoppingList.filter(grocery => grocery.done).sort((a, b) => a.name.localeCompare(b.name));
    });
  }

}
