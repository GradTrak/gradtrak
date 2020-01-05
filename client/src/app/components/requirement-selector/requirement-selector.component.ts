import { Component, OnInit } from '@angular/core';
import { RequirementSet } from 'models/requirement-set.model';

@Component({
  selector: 'app-requirement-selector',
  templateUrl: './requirement-selector.component.html',
  styleUrls: ['./requirement-selector.component.css']
})
export class RequirementSelectorComponent implements OnInit {
  searchPrompt: string;
  searchedMajors: RequirementSet[];
  searchedMinors: RequirementSet[];
  searchedOthers: RequirementSet[];
  constructor() { }

  ngOnInit() {
  }

}
