import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feature-component',
  templateUrl: './feature-component.component.html',
  styleUrls: ['./feature-component.component.scss']
})
export class FeatureComponentComponent implements OnInit {

  @Input('count') count: number;

  constructor() { }

  ngOnInit() {
  }

}
