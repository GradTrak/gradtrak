import { Component, OnInit } from '@angular/core';
import { RequirementSet } from '../requirement-set';

@Component({
  selector: 'app-requirement-set',
  templateUrl: './requirement-set.component.html',
  styleUrls: ['./requirement-set.component.css']
})
export class RequirementSetComponent implements OnInit {
  requirementSet: RequirementSet = {
    id: 'eecs',
    name: 'EECS Major Requirements',
    parent: null,
    requirements: [
      {
        id: 'cs61a',
        name: 'CS 61A',
      },
      {
        id: 'cs61b',
        name: 'CS 61B',
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
