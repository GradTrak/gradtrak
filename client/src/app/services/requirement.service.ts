import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequirementSet } from 'models/requirement-set.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  DUMMY_REQUIREMENT_DATA: RequirementSet[] = [
    {
      id: 'uc',
      name: 'University of California',
      parent: null,
      requirementCategories: [
        {
          id: 'uc',
          name: 'UC Requirements',
          requirements: [
            {
              id: 'elwr',
              name: 'Entry-Level Writing',
            },
            {
              id: 'ah',
              name: 'American History',
            },
            {
              id: 'ai',
              name: 'American Instutions',
            },
          ],
        },
      ],
    },
    {
      id: 'ucb',
      name: 'UC Berkeley',
      parent: null,
      requirementCategories: [
        {
          id: 'ac',
          name: 'American Cultures',
          requirements: [
            {
              id: 'ac',
              name: 'American Cultures',
            },
          ],
        },
      ],
    },
    {
      id: 'coe',
      name: 'College of Engineering',
      parent: null,
      requirementCategories: [
        {
          id: 'coe-hss',
          name: 'Humanities and Social Sciences',
          requirements: [
            {
              id: 'coe-r1a',
              name: 'R&C Part A',
            },
            {
              id: 'coe-r1b',
              name: 'R&C Part B',
            },
            // TODO Add multi-course-style requirements
            {
              id: 'coe-hss1',
              name: 'H/SS',
            },
            {
              id: 'coe-hss2',
              name: 'H/SS',
            },
            {
              id: 'coe-hss-u1',
              name: 'H/SS Upper Division',
            },
            {
              id: 'coe-hss-u2',
              name: 'H/SS Upper Division',
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
          id: 'eecs-math',
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
            {
              id: 'compsci70',
              name: 'COMPSCI 70',
            },
          ],
        },
        {
          id: 'eecs-physics',
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
        {
          id: 'eecs-lower-div',
          name: 'Lower Division',
          requirements: [
            {
              id: 'compsci61a',
              name: 'COMPSCI 61A',
            },
            {
              id: 'compsci61b',
              name: 'COMPSCI 61B',
            },
            {
              id: 'compsci61c',
              name: 'COMPSCI 61A',
            },
            {
              id: 'eecs16a',
              name: 'EECS 16A',
            },
            {
              id: 'eecs16b',
              name: 'EECS 16B',
            },
          ],
        },
        {
          id: 'eecs-upper-div',
          name: 'Upper Division',
          requirements: [
            // TODO Add unit-style requirements
            {
              id: 'eecs-upper-1',
              name: 'Upper Division',
            },
            {
              id: 'eecs-upper-2',
              name: 'Upper Division',
            },
            {
              id: 'eecs-upper-3',
              name: 'Upper Division',
            },
            {
              id: 'eecs-upper-4',
              name: 'Upper Division',
            },
            {
              id: 'eecs-upper-5',
              name: 'Upper Division',
            },
          ],
        },
        {
          id: 'eecs-ethics',
          name: 'Ethics',
          requirements: [
            {
              id: 'compsci195',
              name: 'COMPSCI 195',
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
