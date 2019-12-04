import { Component, OnInit } from '@angular/core';
import { RequirementSet } from '../requirement-set'

@Component({
  selector: 'app-requirements-pane',
  templateUrl: './requirements-pane.component.html',
  styleUrls: ['./requirements-pane.component.css']
})
export class RequirementsPaneComponent implements OnInit {
  requirementSets: RequirementSet[] = [
    {
      id: 'coe',
      name: 'College of Engineering',
      parent: null,
      requirementCategories: [
        {
          id: 'math',
          name: 'Math',
          requirements: [
            {
              id: 'math1a',
              name: 'MATH 1A',
            },
            {
              id: 'math1b',
              name: 'MATH 1B',
            },
          ],
        },
      ],
    },
    {
      id: 'eecs',
      name: 'EECS Major',
      parent: null,
      requirementCategories: [
        {
          id: 'eecs-lower-div',
          name: 'Lower Division Requirements',
          requirements: [
            {
              id: 'cs61a',
              name: 'CS 61A',
            },
            {
              id: 'cs61b',
              name: 'CS 61B',
            },
          ],
        },
      ],
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
