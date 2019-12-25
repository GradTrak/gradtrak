import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Requirement } from 'models/requirement.model';
import { RequirementSet } from 'models/requirement-set.model';
import { CourseRequirement } from 'models/requirements/course-requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { TagRequirement } from 'models/requirements/tag-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';
import { CourseService } from 'services/course.service';

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
      requirementCategories: [
        {
          id: 'eecs-math',
          name: 'Math',
          requirements: [
            {
              type: 'course',
              id: 'math1a',
              name: 'MATH 1A',
              courseId: 'math1a',
            },
            {
              type: 'course',
              id: 'math1b',
              name: 'MATH 1B',
              courseId: 'math1b',
            },
            {
              type: 'course',
              id: 'compsci70',
              name: 'COMPSCI 70',
              courseId: 'compsci70',
            },
          ],
        },
        {
          id: 'eecs-physics',
          name: 'Physics',
          requirements: [
            {
              type: 'course',
              id: 'physics7a',
              name: 'PHYSICS 7A',
              courseId: 'physics7a',
            },
            {
              type: 'course',
              id: 'physics7b',
              name: 'PHYSICS 7B',
              courseId: 'physics7b',
            },
          ],
        },
        {
          id: 'eecs-lower-div',
          name: 'Lower Division',
          requirements: [
            {
              type: 'multi',
              id: 'compsci61a47a',
              name: 'COMPSCI 61A',
              numRequired: 1,
              hidden: true,
              requirements: [
                {
                  type: 'course',
                  id: 'compsci61a',
                  name: 'COMPSCI 61A',
                  courseId: 'compsci61a',
                },
                {
                  type: 'course',
                  id: 'compsci47a',
                  name: 'COMPSCI 47A',
                  courseId: 'compsci47a',
                },
              ],
            },
            {
              type: 'multi',
              id: 'compsci61b47b',
              name: 'COMPSCI 61B',
              numRequired: 1,
              hidden: true,
              requirements: [
                {
                  type: 'course',
                  id: 'compsci61b',
                  name: 'COMPSCI 61B',
                  courseId: 'compsci61b',
                },
                {
                  type: 'course',
                  id: 'compsci47b',
                  name: 'COMPSCI 47B',
                  courseId: 'compsci47b',
                },
              ],
            },
            {
              type: 'multi',
              id: 'compsci61c47c',
              name: 'COMPSCI 61C',
              numRequired: 1,
              hidden: true,
              requirements: [
                {
                  type: 'course',
                  id: 'compsci61c',
                  name: 'COMPSCI 61C',
                  courseId: 'compsci61c',
                },
                {
                  type: 'course',
                  id: 'compsci47c',
                  name: 'COMPSCI 47C',
                  courseId: 'compsci47c',
                },
              ],
            },
            {
              type: 'course',
              id: 'eecs16a',
              name: 'EECS 16A',
              courseId: 'eecs16a',
            },
            {
              type: 'course',
              id: 'eecs16b',
              name: 'EECS 16B',
              courseId: 'eecs16b',
            },
          ],
        },
        {
          id: 'eecs-upper-div',
          name: 'Upper Division',
          requirements: [
            {
              type: 'unit',
              id: 'eecs-upper-div',
              name: 'Upper Division',
              units: 20,
              requirement: {
                type: 'tag',
                id: 'eecs-upper-div-course',
                name: 'EECS Upper Division Course',
                tag: 'eecs-upper-div',
              },
            },
          ],
        },
        {
          id: 'eecs-ethics',
          name: 'Ethics',
          requirements: [
            {
              type: 'course',
              id: 'compsci195',
              name: 'COMPSCI 195',
              courseId: 'compsci195',
            },
          ],
        },
      ],
    },
    linguis: {
      id: 'linguis',
      name: 'Linguistics Major',
      parentId: 'ls',
      requirementCategories: [
        {
          id: 'linguis100',
          name: 'LINUIGS 100',
          requirements: [
            {
              type: 'course',
              id: 'linguis100',
              name: 'LINGUIS 100',
              courseId: 'linguis100',
            },
          ],
        },
        {
          id: 'linguis-core',
          name: 'Core',
          requirements: [
            {
              type: 'multi',
              id: 'linguis-core',
              name: 'Linguistics Core',
              numRequired: 4,
              requirements: [
                {
                  type: 'course',
                  id: 'linguis110',
                  name: 'LINGUIS 110',
                  courseId: 'linguis110',
                },
                {
                  type: 'course',
                  id: 'linguis111',
                  name: 'LINGUIS 111',
                  courseId: 'linguis111',
                },
                {
                  type: 'course',
                  id: 'linguis115',
                  name: 'LINGUIS 115',
                  courseId: 'linguis115',
                },
                {
                  type: 'course',
                  id: 'linguis120',
                  name: 'LINGUIS 120',
                  courseId: 'linguis120',
                },
                {
                  type: 'course',
                  id: 'linguis130',
                  name: 'LINGUIS 130',
                  courseId: 'linguis130',
                },
              ],
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

  constructor(private courseService: CourseService) {}

  getRequirements(): Observable<RequirementSet[]> {
    return of(this.DUMMY_REQUIREMENT_DATA).pipe(
      map(this.linkParents),
      flatMap((data) => this.prepareRequirements(data))
    );
  }

  linkParents(data: object): RequirementSet[] {
    Object.values(data).forEach((requirementSet) => {
      requirementSet.parent = requirementSet.parentId ? data[requirementSet.parentId] : null;
      delete requirementSet.parentId;
    });
    return Object.values(data);
  }

  prepareRequirements(data: object): Observable<RequirementSet[]> {
    return this.courseService.getCourses().pipe(
      map((courses) => {
        // Build object with course.id as keys and course as values
        const coursesObj = courses.reduce((obj, course) => {
          const nextObj = { ...obj };
          nextObj[course.id] = course;
          return nextObj;
        }, {});

        // Instantiate requirement types and link courseIds to Course objects
        return Object.values(data).map((rawSet) => {
          const requirementSet = { ...rawSet };

          requirementSet.requirementCategories = requirementSet.requirementCategories.map((rawCategory) => {
            const requirementCategory = { ...rawCategory };
            requirementCategory.requirements = requirementCategory.requirements.map((rawReq) =>
              this.getRequirementObject(rawReq, coursesObj)
            );
            return requirementCategory;
          });

          return requirementSet;
        });
      })
    );
  }

  getRequirementObject(rawReq, coursesObj): Requirement {
    let requirement = { ...rawReq };

    switch (requirement.type) {
      case 'course':
        requirement.course = coursesObj[requirement.courseId];
        delete requirement.courseId;
        requirement = new CourseRequirement(requirement);
        break;

      case 'tag':
        requirement = new TagRequirement(requirement);
        break;

      case 'multi':
        requirement.requirements = requirement.requirements.map((rawChildReq) =>
          this.getRequirementObject(rawChildReq, coursesObj)
        );
        requirement = new MultiRequirement(requirement);
        break;

      case 'unit':
        requirement.requirement = this.getRequirementObject(requirement.requirement, coursesObj);
        requirement = new UnitRequirement(requirement);
        break;

      default:
        // Do nothing
        break;
    }

    delete requirement.type;
    return requirement;
  }
}
