import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchItem} from '../../../models/search-item.model';
import {Meal} from '../../../models/meal.model';
import {Menu} from '../../../models/menu.model';

@Component({
  selector: 'grocs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() searchItems: SearchItem<Meal | Menu>[] = [];
  @Output() addItem = new EventEmitter<Meal | Menu>();

  public filteredItems: SearchItem<any>[];

  constructor() { }

  ngOnInit() {
    this.filteredItems = this.searchItems;
  }

  search(search: string) {
    this.filteredItems = this.searchItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }

  setItem(item: SearchItem<Meal>) {
    this.addItem.emit(item.item);
  }

}
