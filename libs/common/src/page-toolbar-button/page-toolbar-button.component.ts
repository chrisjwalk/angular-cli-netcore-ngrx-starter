import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
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
