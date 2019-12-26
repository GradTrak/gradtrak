import { Component, Input, OnInit } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';

@Component({
  selector: 'app-requirement-set',
  templateUrl: './requirement-set.component.html',
  styleUrls: ['./requirement-set.component.scss'],
})
export class RequirementSetComponent implements OnInit {
  @Input() requirementSet: RequirementSet;

  constructor() {}

  ngOnInit(): void {}
}
