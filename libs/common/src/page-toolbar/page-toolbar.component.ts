import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-page-toolbar',
  templateUrl: './page-toolbar.component.html',
  styleUrls: ['./page-toolbar.component.scss'],
})
export class PageToolbarComponent {
  @Input() title: string;
}
