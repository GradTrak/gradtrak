/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { RequirementCategory } from 'models/requirement-category.model';
import { RequirementSet } from 'models/requirement-set.model';
import { PolyRequirement } from 'models/requirements/poly-requirement.model';
import { CourseRequirement } from 'models/requirements/course-requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { MutexRequirement } from 'models/requirements/mutex-requirement.model';
import { TagRequirement } from 'models/requirements/tag-requirement.model';
import { UnitRequirement } from 'models/requirements/unit-requirement.model';
import { Tag } from 'models/tag.model';
import { CourseService } from 'services/course.service';
import { TagService } from 'services/tag.service';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  private static readonly REQUIREMENT_API_ENDPOINT = '/api/requirements';

  private sharedRequirementsMap: Observable<Map<string, RequirementSet>>;

  constructor(private courseService: CourseService, private tagService: TagService, private http: HttpClient) {}

  getRequirements(): Observable<RequirementSet[]> {
    if (!this.sharedRequirementsMap) {
      this.fetchRequirementData();
    }
    return this.sharedRequirementsMap.pipe(map((data: Map<string, RequirementSet>) => Array.from(data.values())));
  }

  getRequirementsMap(): Observable<Map<string, RequirementSet>> {
    if (!this.sharedRequirementsMap) {
      this.fetchRequirementData();
    }
    return this.sharedRequirementsMap;
  }

  private fetchRequirementData(): void {
    this.sharedRequirementsMap = this.http.get(RequirementService.REQUIREMENT_API_ENDPOINT).pipe(
      map((data: any) => new Map<string, any>(Object.entries(data))),
      map(this.linkParents),
      flatMap((data: Map<string, any>) => this.prepareRequirements(data)),
      map(this.instantiateSetsAndCategories),
      shareReplay(),
    );
  }

  private instantiateSetsAndCategories(data: Map<string, any>): Map<string, RequirementSet> {
    data.forEach((rawSet: any, setKey: string) => {
      rawSet.requirementCategories = rawSet.requirementCategories.map(
        (rawCategory: any) => new RequirementCategory(rawCategory),
      );
      data.set(setKey, new RequirementSet(rawSet));
    });
    return data;
  }

  // FIXME Linked parents are not instances
  private linkParents(data: Map<string, any>): Map<string, any> {
    data.forEach((rawSet: any) => {
      if (rawSet.parentId) {
        rawSet.parent = data.get(rawSet.parentId);
        if (!rawSet.parent) {
          console.error(`No RequirementSet object found for parent ID: ${rawSet.parentId}`);
          rawSet.parent = null;
        }
      } else {
        rawSet.parent = null;
      }
      delete rawSet.parentId;
    });
    return data;
  }

  private prepareRequirements(data: Map<string, any>): Observable<Map<string, any>> {
    return forkJoin({
      coursesMap: this.courseService.getCoursesMap(),
      tagsMap: this.tagService.getTagsMap(),
    }).pipe(
      map((serviceObj: { coursesMap: Map<string, Course>; tagsMap: Map<string, Tag> }) => {
        // Instantiate requirement types and link courseIds to Course objects
        data.forEach((rawSet: any) => {
          rawSet.requirementCategories.forEach((rawCategory: any) => {
            rawCategory.requirements = rawCategory.requirements.map((rawReq: any) =>
              this.getRequirementObject(rawReq, serviceObj),
            );
          });
        });
        return data;
      }),
    );
  }

  private getRequirementObject(
    rawReq: any,
    serviceObj: { coursesMap: Map<string, Course>; tagsMap: Map<string, Tag> },
  ): Requirement {
    const { coursesMap, tagsMap } = serviceObj;

    let requirement: any = { ...rawReq };

    switch (requirement.type) {
      case 'course':
        requirement.course = coursesMap.get(requirement.courseId);
        if (!requirement.course) {
          console.error(`No Course object found for course ID: ${requirement.courseId}`);
        }
        delete requirement.courseId;
        requirement = new CourseRequirement(requirement);
        break;

      case 'tag':
        requirement.tag = tagsMap.get(requirement.tagId);
        if (!requirement.tag) {
          console.error(`No Tag object found for tag ID: ${requirement.tagId}`);
        }
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
        console.error(`Requirement ${requirement.id} has unknown Requirement type: ${requirement.type}`);
        break;
    }

    delete requirement.type;
    return requirement;
  }
}
