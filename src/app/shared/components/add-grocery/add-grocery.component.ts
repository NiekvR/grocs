import {Component, EventEmitter, Output} from '@angular/core';
import {faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import {Grocery} from '../../../models/grocery.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'grocs-add-grocery',
  templateUrl: './add-grocery.component.html',
  styleUrls: ['./add-grocery.component.scss'],
  // animations: [
  //   trigger('collapse', [
  //     state('open', style({
  //       width: '100%'
  //     })),
  //     state('closed', style({
  //       width: '52px',
  //     })),
  //     transition('open => closed', animate('0.4s ease-out')),
  //     transition('closed => open', animate('0.3s ease-in')),
  //   ]),
  // ],
})
export class AddGroceryComponent {
  faPlusSquare = faPlusSquare;

  @Output() new = new EventEmitter<Grocery>();

  public item = '';
  public open = false;

  constructor() { }

  public addGrocery() {
    this.open = !this.open;
    if (!!this.item && this.item.length > 0) {
      const newGrocery: Grocery = {
        name: this.item,
        selected: true,
        done: false,
        date: new Date().toString()
      };
      this.item = '';
      this.new.emit(newGrocery);
    }
  }
}
