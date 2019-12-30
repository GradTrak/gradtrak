import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequirementSet } from 'models/requirement-set.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  DUMMY_REQUIREMENT_DATA: object = {
    uc: {
      id: 'uc',
      name: 'University of California',
      parentId: null,
      requirementCategories: [
        {
          id: 'uc',
          name: 'UC Requirements',
          selectable: false,
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
    ucb: {
      id: 'ucb',
      name: 'UC Berkeley',
      parentId: 'uc',
      selectable: false,
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
    coe: {
      id: 'coe',
      name: 'College of Engineering',
      parentId: 'ucb',
      requirementCategories: [
        {
          id: 'coe-hss',
          name: 'Humanities and Social Sciences',
          selectable: false,
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
    ls: {
      id: 'ls',
      name: 'College of Letters and Sciences',
      parentId: 'ucb',
      selectable: false,
      requirementCategories: [
        {
          id: 'ls-essential',
          name: 'Essential Skills',
          requirements: [
            {
              id: 'ls-r1a',
              name: 'R&C Part A',
            },
            {
              id: 'ls-r1b',
              name: 'R&C Part B',
            },
            {
              id: 'ls-quant',
              name: 'Quantitative Reasoning',
            },
            {
              id: 'ls-lang',
              name: 'Foreign Language',
            },
          ],
        },
        {
          id: 'ls-breadth',
          name: 'Breadth Requirements',
          requirements: [
            {
              id: 'ls-arts',
              name: 'Arts and Literature',
            },
            {
              id: 'ls-bio',
              name: 'Biological Science',
            },
            {
              id: 'ls-hist',
              name: 'Historical Studies',
            },
            {
              id: 'ls-inter',
              name: 'International Studies',
            },
            {
              id: 'ls-philo',
              name: 'Philosophy and Values',
            },
            {
              id: 'ls-phys',
              name: 'Physical Science',
            },
            {
              id: 'ls-socio',
              name: 'Social and Behavioral Science',
            },
          ],
        },
      ],
    },
    eecs: {
      id: 'eecs',
      name: 'EECS Major',
      parentId: 'coe',
      selectable: true,
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
    linguis: {
      id: 'linguis',
      name: 'Linguistics Major',
      parentId: 'ls',
      selectable: true,
      requirementCategories: [
        {
          id: 'linguis100',
          name: 'LINUIGS 100',
          requirements: [
            {
              id: 'linguis100',
              name: 'LINGUIS 100',
            },
          ],
        },
        {
          id: 'linguis-core',
          name: 'Core',
          requirements: [
            // TODO Add N of set of requirements
            {
              id: 'linguis110',
              name: 'LINGUIS 110',
            },
            {
              id: 'linguis111',
              name: 'LINGUIS 111',
            },
            {
              id: 'linguis115',
              name: 'LINGUIS 115',
            },
            {
              id: 'linguis120',
              name: 'LINGUIS 120',
            },
            {
              id: 'linguis130',
              name: 'LINGUIS 130',
            },
          ],
        },
        {
          id: 'linguis-electives',
          name: 'Electives',
          requirements: [
            // TODO Add unit-style requirements
            {
              id: 'linguis-elective-1',
              name: 'Elective 1',
            },
            {
              id: 'linguis-elective-2',
              name: 'Elective 2',
            },
            {
              id: 'linguis-elective-3',
              name: 'Elective 3',
            },
          ],
        },
      ],
    },
  };

  constructor() {}

  getRequirements(): Observable<RequirementSet[]> {
    return of(this.DUMMY_REQUIREMENT_DATA).pipe(map(this.linkParents));
  }

  linkParents(data: object): RequirementSet[] {
    Object.values(data).forEach((requirementSet) => {
      requirementSet.parent = requirementSet.parentId ? data[requirementSet.parentId] : null;
      delete requirementSet.parentId;
    });
    return Object.values(data);
  }
}
