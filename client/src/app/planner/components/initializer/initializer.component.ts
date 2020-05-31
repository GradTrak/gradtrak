import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequirementSet } from '../../models/requirement-set.model';

@Component({
  selector: 'app-initializer',
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
})
export class InitializerComponent implements OnInit {
  //@Output
  majors: RequirementSet[];
  startYear: number;
  gradYear: number;
  summer: boolean;

  constructor() {
  }

  ngOnInit(): void {}

  submit(): void {

  }
}
