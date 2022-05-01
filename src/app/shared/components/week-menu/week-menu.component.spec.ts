import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekMenuComponent } from './week-menu.component';

describe('WeekMenuComponent', () => {
  let component: WeekMenuComponent;
  let fixture: ComponentFixture<WeekMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
