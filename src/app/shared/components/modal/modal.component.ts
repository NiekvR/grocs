import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'grocs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() active = false;
  @Output() activeChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public dismissModal() {
    this.active = !this.active;
    this.activeChange.emit(this.active);
  }
}
