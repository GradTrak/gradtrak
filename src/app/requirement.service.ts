import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequirementSet } from 'models/requirement-set.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  DUMMY_REQUIREMENT_DATA: RequirementSet[] = [
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
        {
          id: 'physics',
          name: 'Physics',
          requirements: [
            {
              id: 'physics7a',
              name: 'PHYSICS 7A',
            },
            {
              id: 'physics7b',
              name: 'PHYSICS 7B',
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

  constructor() {}

  getRequirements(): Observable<RequirementSet[]> {
    return of(this.DUMMY_REQUIREMENT_DATA);
  }
}
