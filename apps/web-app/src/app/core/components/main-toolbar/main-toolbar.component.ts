import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {
  @Output() toggleSidenav = new EventEmitter<boolean>();

  emitToggleSidenav() {
    this.toggleSidenav.emit(true);
  }
}
