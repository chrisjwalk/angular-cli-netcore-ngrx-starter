import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-toolbar-button',
  templateUrl: './page-toolbar-button.component.html',
  styleUrls: ['./page-toolbar-button.component.scss']
})
export class PageToolbarButtonComponent implements OnInit {
  @Input() tooltip: string;
  tooltipDisabled: boolean;
  constructor() { }

  ngOnInit() {
    this.tooltipDisabled = !this.tooltip;
  }

}
