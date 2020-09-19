import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-toolbar-button',
  templateUrl: './page-toolbar-button.component.html',
  styleUrls: ['./page-toolbar-button.component.scss'],
})
export class PageToolbarButtonComponent implements OnInit {
  @Input() tooltip: string;
  tooltipDisabled: boolean;

  ngOnInit() {
    this.tooltipDisabled = !this.tooltip;
  }
}
