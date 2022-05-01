import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {MealService} from '../../core/services/collections/meal/meal.service';
import {Meal} from '../../models/meal.model';
import {Location} from '@angular/common';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Grocery} from '../../models/grocery.model';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'grocs-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss']
})
export class MealComponent implements OnInit {
  faTimes = faTimes;

  @ViewChild('groceries', { static: false }) groceries;

  public mealForm: FormGroup;
  public edit = false;

  public meal: Meal;

  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private location: Location,
              private mealService: MealService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getMeal();
  }

  public addItem() {
    const items = this.mealForm.get('items') as FormArray;
    items.push(this.createItem());
    this.cdRef.detectChanges();
    const nodes = this.groceries.nativeElement.querySelectorAll('.grocery');
    nodes[nodes.length - 1].querySelector('input').focus();
  }

  public removeItem(index: number) {
    const items = this.mealForm.get('items') as FormArray;
    items.removeAt(index);
  }

  public back() {
    this.location.back();
  }

  public submit() {
    const newMeal: Meal = this.mealForm.value;
    newMeal.items.forEach(grocery => grocery.selected = true);
    newMeal.id = !!this.meal ? this.meal.id : null;
    const save = !!this.meal ?
      this.mealService.update(newMeal) :
      this.mealService.add(newMeal);

    // @ts-ignore
    save.subscribe(meal => {
        this.meal = !!meal ? meal : newMeal;
        this.edit = false;
    });
  }

  public getMeal() {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => !!id ? this.mealService.get(id) : of(null)))
      .subscribe(meal => {
        if (!!meal) {
          this.meal = meal;
          this.mealForm = this.formBuilder.group({
            id: [meal.id],
            name: [meal.name, Validators.required],
            description: [meal.description, Validators.required],
            items: this.formBuilder.array(this.createItems(meal.items))
          });
        } else {
          this.mealForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            items: this.formBuilder.array([ this.createItem() ])
          });
          this.edit = true;
        }
      });
  }

  public trackByFn(index: any, item: any) {
    return index;
  }

  private createItems(items: Grocery[]): FormGroup[] {
    return items.map(item => this.createItem(item));
  }

  private createItem(item?: Grocery): FormGroup {
    return this.formBuilder.group({
      name: [!!item ? item.name : '']
    });
  }

}
