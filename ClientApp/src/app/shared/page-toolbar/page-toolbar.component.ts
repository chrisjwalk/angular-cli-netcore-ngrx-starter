import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-toolbar',
  templateUrl: './page-toolbar.component.html',
  styleUrls: ['./page-toolbar.component.scss']
})
export class PageToolbarComponent implements OnInit {
  @Input('title') title: string;
  constructor() { }

  ngOnInit() {
  }

}
