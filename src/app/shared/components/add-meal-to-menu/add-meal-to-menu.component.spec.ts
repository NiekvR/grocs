import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealToMenuComponent } from './add-meal-to-menu.component';

describe('AddMealToMenuComponent', () => {
  let component: AddMealToMenuComponent;
  let fixture: ComponentFixture<AddMealToMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMealToMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMealToMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
