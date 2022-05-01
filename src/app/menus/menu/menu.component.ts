import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Menu, MenuMeal} from '../../models/menu.model';
import {Grocery} from '../../models/grocery.model';
import {map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MenuService} from '../../core/services/collections/menu/menu.service';
import {Meal} from '../../models/meal.model';
import {GroceryService} from '../../core/services/collections/grocery/grocery.service';
import {
  faCheckCircle,
  faCheckSquare,
  faFileImport,
  faMinusCircle,
  faNotesMedical,
  faSquare
} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'grocs-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  faSquare = faSquare;
  faCheckSquare = faCheckSquare;
  faNotesMedical = faNotesMedical;
  faFileImport = faFileImport;
  faMinusCircle = faMinusCircle;
  faCheckCircle = faCheckCircle;

  public menuForm: FormGroup;
  public edit = false;

  public selecting = false;
  public selectMenu = false;
  public menu: Menu;
  public newMenu: Menu;
  public name: string;

  public groceries: Grocery[] = [];
  private menuMeals: { [dayOfWeek: number ]: MenuMeal };

  constructor(private location: Location, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute, private menuService: MenuService, private groceryService: GroceryService,
              private toastrService: ToastrService) { }

  ngOnInit() {
    this.getMenu();
  }

  public back() {
    this.selectMenu ?
      this.selectMenu = false :
      this.location.back();
  }

  public getMenu() {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => !!id ? this.menuService.get(id) : of(null)))
      .subscribe(menu => {
        if (!!menu) {
          this.menu = menu;
          this.newMenu = menu;
          this.name = menu.name;
          this.menuMeals = menu.meals;
          this.groceries = menu.groceries;
          this.menuForm = this.formBuilder.group({
            id: [menu.id],
            name: [menu.name, Validators.required]
          });
        } else {
          this.menuForm = this.formBuilder.group({
            name: ['', Validators.required]
          });
          this.edit = true;
        }
      });
  }

  public addMenuMeal(meal: { [dayOfWeek: number ]: Meal }) {
    if (!!this.menuMeals && !!this.menuMeals[Object.keys(meal)[0]]) {
      this.groceries = this.groceries.filter(grocery => grocery.mealId !== this.menuMeals[Object.keys(meal)[0]].mealId);
    }
    this.menuMeals = { ...this.menuMeals, ...this.addMeal(meal) };
  }

  public removeMenuMeal(day: number) {
    if (!!this.menuMeals && !!this.menuMeals[day]) {
      this.groceries = this.groceries.filter(grocery => grocery.mealId !== this.menuMeals[day].mealId);
    }
    delete this.menuMeals[ day ];
  }

  public submit() {
    const newMenu: Menu = {} as Menu;
    newMenu.name = this.name;
    newMenu.meals = this.menuMeals;
    newMenu.groceries = this.groceries;
    newMenu.id = !!this.menu ? this.menu.id : null;
    const save = !!this.menu ?
      this.menuService.update(newMenu) :
      this.menuService.add(newMenu);

    // @ts-ignore
    save.subscribe(meal => {
      this.menu = !!meal ? meal : newMenu;
      this.edit = false;
    });
  }

  public deleteGroceryItem(index: number) {
    this.groceries.splice(index, 1);
  }

  public addGrocery(grocery: Grocery) {
    this.groceries.unshift(grocery);
  }

  public sendToList() {
    if (this.selecting) {
      const shoppingList = this.groceries.filter(grocery => grocery.selected);
      this.groceryService.addListToShoppingList(shoppingList)
        .subscribe(() => {
          this.toastrService.success('Boodschappen toegevoegd aan de boodschappenlijst.');
          this.selecting = !this.selecting;
        });
    } else {
      this.selecting = !this.selecting;
    }
  }

  private addMeal(meal: { [dayOfWeek: number ]: Meal }): { [dayOfWeek: number ]: MenuMeal } {
    Object.keys(meal).forEach(key => meal[ key ] = this.convertMealToMenuMeal(meal[ key ]));
    return meal;
  }

  private convertMealToMenuMeal(meal: Meal): MenuMeal {
    meal.items.forEach(grocery => grocery.mealId = meal.id);
    this.groceries = this.groceries.concat(meal.items);
    this.groceries = this.groceries.sort((a: Grocery, b: Grocery) => a.name.localeCompare(b.name));
    return {
      name: meal.name,
      mealId: meal.id
    };
  }

}
