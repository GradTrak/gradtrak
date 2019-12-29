import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { Requirement } from 'models/requirement.model';
import { RequirementCategory } from 'models/requirement-category.model';
import { RequirementSet } from 'models/requirement-set.model';
import { PolyRequirement } from 'models/requirements/poly-requirement.model';
import { CourseRequirement } from 'models/requirements/course-requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { MutexRequirement } from 'models/requirements/mutex-requirement.model';
import { TagRequirement } from 'models/requirements/tag-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';
import { CourseService } from 'services/course.service';
import { TagService } from 'services/tag.service';

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
          id: 'coe_hss',
          name: 'Humanities and Social Sciences',
          requirements: [
            {
              id: 'coe_r1a',
              name: 'R&C Part A',
            },
            {
              id: 'coe_r1b',
              name: 'R&C Part B',
            },
            // TODO Add multi-course-style requirements
            {
              id: 'coe_hss1',
              name: 'H/SS',
            },
            {
              id: 'coe_hss2',
              name: 'H/SS',
            },
            {
              id: 'coe_hss_u1',
              name: 'H/SS Upper Division',
            },
            {
              id: 'coe_hss_u2',
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
          id: 'ls_essential',
          name: 'Essential Skills',
          requirements: [
            {
              id: 'ls_r1a',
              name: 'R&C Part A',
            },
            {
              id: 'ls_r1b',
              name: 'R&C Part B',
            },
            {
              id: 'ls_quant',
              name: 'Quantitative Reasoning',
            },
            {
              id: 'ls_lang',
              name: 'Foreign Language',
            },
          ],
        },
        {
          id: 'ls_breadth',
          name: 'Breadth Requirements',
          requirements: [
            {
              type: 'mutex',
              id: 'ls_breadth',
              name: 'L&S Breadth Requirements',
              requirements: [
                {
                  type: 'tag',
                  id: 'ls_arts',
                  name: 'Arts and Literature',
                  tagId: 'ls_arts',
                },
                {
                  type: 'tag',
                  id: 'ls_bio',
                  name: 'Biological Science',
                  tagId: 'ls_bio',
                },
                {
                  type: 'tag',
                  id: 'ls_hist',
                  name: 'Historical Studies',
                  tagId: 'ls_hist',
                },
                {
                  type: 'tag',
                  id: 'ls_inter',
                  name: 'International Studies',
                  tagId: 'ls_inter',
                },
                {
                  type: 'tag',
                  id: 'ls_philo',
                  name: 'Philosophy and Values',
                  tagId: 'ls_philo',
                },
                {
                  type: 'tag',
                  id: 'ls_phys',
                  name: 'Physical Science',
                  tagId: 'ls_phys',
                },
                {
                  type: 'tag',
                  id: 'ls_socio',
                  name: 'Social and Behavioral Science',
                  tagId: 'ls_socio',
                },
              ],
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
          id: 'eecs_math',
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
          id: 'eecs_physics',
          name: 'Physics',
          requirements: [
            {
              type: 'multi',
              id: 'eecs_physics',
              name: 'EECS Physics',
              numRequired: 1,
              hidden: false,
              requirements: [
                {
                  type: 'multi',
                  id: 'eecs_physics7',
                  name: 'EECS Physics 7A/B',
                  numRequired: 2,
                  hidden: false,
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
                  type: 'multi',
                  id: 'eecs_physics5',
                  name: 'EECS Physics 5A/B',
                  numRequired: 2,
                  hidden: false,
                  requirements: [
                    {
                      type: 'course',
                      id: 'physics5a',
                      name: 'PHYSICS 5A',
                      courseId: 'physics5a',
                    },
                    {
                      type: 'course',
                      id: 'physics5b',
                      name: 'PHYSICS 5B',
                      courseId: 'physics5b',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'eecs_lower_div',
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
          id: 'eecs_upper_div',
          name: 'Upper Division',
          requirements: [
            {
              type: 'unit',
              id: 'eecs_upper_div',
              name: 'Upper Division',
              units: 20,
              requirement: {
                type: 'tag',
                id: 'eecs_upper_div_course',
                name: 'EECS Upper Division Course',
                tagId: 'eecs_upper_div',
              },
            },
          ],
        },
        {
          id: 'eecs_ethics',
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
          id: 'linguis_core',
          name: 'Core',
          requirements: [
            {
              type: 'multi',
              id: 'linguis_core',
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
          id: 'linguis_electives',
          name: 'Electives',
          requirements: [
            // TODO Add unit-style requirements
            {
              id: 'linguis_elective_1',
              name: 'Elective 1',
            },
            {
              id: 'linguis_elective_2',
              name: 'Elective 2',
            },
            {
              id: 'linguis_elective_3',
              name: 'Elective 3',
            },
          ],
        },
      ],
    },
  };

  private sharedRequirementsObj: Observable<object>;

  constructor(private courseService: CourseService, private tagService: TagService) {}

  getRequirements(): Observable<RequirementSet[]> {
    if (!this.sharedRequirementsObj) {
      this.fetchRequirementData();
    }
    return this.sharedRequirementsObj.pipe(map(Object.values));
  }

  getRequirementsObj(): Observable<object> {
    if (!this.sharedRequirementsObj) {
      this.fetchRequirementData();
    }
    return this.sharedRequirementsObj;
  }

  private fetchRequirementData(): void {
    this.sharedRequirementsObj = of(this.DUMMY_REQUIREMENT_DATA).pipe(
      map(this.linkParents),
      flatMap((data: object) => this.prepareRequirements(data)),
      map(this.instantiateSetsAndCategories),
      shareReplay(),
    );
  }

  private instantiateSetsAndCategories(data: object): object {
    Object.keys(data).forEach((setKey: string) => {
      data[setKey].requirementCategories = data[setKey].requirementCategories.map(
        (rawCategory: object) => new RequirementCategory(rawCategory),
      );
      data[setKey] = new RequirementSet(data[setKey]);
    });
    return data;
  }

  private linkParents(data: object): object {
    Object.values(data).forEach((requirementSet) => {
      requirementSet.parent = requirementSet.parentId ? data[requirementSet.parentId] : null;
      delete requirementSet.parentId;
    });
    return data;
  }

  private prepareRequirements(data: object): Observable<object> {
    return forkJoin({
      coursesObj: this.courseService.getCoursesObj(),
      tagsObj: this.tagService.getTagsObj(),
    }).pipe(
      map((serviceObj: { coursesObj: object; tagsObj: object }) => {
        // Instantiate requirement types and link courseIds to Course objects
        Object.values(data).forEach((rawSet) => {
          rawSet.requirementCategories.forEach((rawCategory) => {
            rawCategory.requirements = rawCategory.requirements.map((rawReq) =>
              this.getRequirementObject(rawReq, serviceObj),
            );
          });
        });
        return data;
      }),
    );
  }

  private getRequirementObject(rawReq, serviceObj: { coursesObj: object; tagsObj: object }): Requirement {
    const { coursesObj, tagsObj } = serviceObj;

    let requirement = { ...rawReq };

    switch (requirement.type) {
      case 'course':
        requirement.course = coursesObj[requirement.courseId];
        delete requirement.courseId;
        requirement = new CourseRequirement(requirement);
        break;

      case 'tag':
        requirement.tag = tagsObj[requirement.tagId];
        delete requirement.tagId;
        requirement = new TagRequirement(requirement);
        break;

      case 'multi':
      case 'poly':
        requirement.requirements = requirement.requirements.map((rawChildReq) =>
          this.getRequirementObject(rawChildReq, serviceObj),
        );
        switch (requirement.type) {
          case 'multi':
            requirement = new MultiRequirement(requirement);
            break;

          case 'poly':
            requirement = new PolyRequirement(requirement);
            break;

          default:
            // Do nothing
            break;
        }
        break;

      case 'mutex':
        requirement.requirements = requirement.requirements.map((rawChildReq) =>
          this.getRequirementObject(rawChildReq, serviceObj),
        );
        requirement = new MutexRequirement(requirement);
        break;

      case 'unit':
        requirement.requirement = this.getRequirementObject(requirement.requirement, serviceObj);
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
