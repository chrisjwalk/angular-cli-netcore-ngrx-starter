import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-big-button',
  templateUrl: './big-button.component.html',
  styleUrls: ['./big-button.component.scss'],
  imports: [CommonModule, MatButtonModule],
})
export class BigButtonComponent {}
