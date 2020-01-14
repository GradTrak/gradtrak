import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
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
  private static readonly REQUIREMENT_API_ENDPOINT = '/api/requirements';

  private sharedRequirementsObj: Observable<object>;

  constructor(private courseService: CourseService, private tagService: TagService, private http: HttpClient) {}

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
    this.sharedRequirementsObj = this.http.get(RequirementService.REQUIREMENT_API_ENDPOINT).pipe(
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
      if (requirementSet.parentId) {
        requirementSet.parent = data[requirementSet.parentId];
        if (!requirementSet.parent) {
          console.error(`No RequirementSet object found for parent ID: ${requirementSet.parentId}`);
          requirementSet.parent = null;
        }
      } else {
        requirementSet.parent = null;
      }
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
        if (!requirement.course) {
          console.error(`No Course object found for course ID: ${requirement.courseId}`);
        }
        delete requirement.courseId;
        requirement = new CourseRequirement(requirement);
        break;

      case 'tag':
        requirement.tag = tagsObj[requirement.tagId];
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
        console.error(`Unknown Requirement type: ${requirement.type}`);
        break;
    }

    delete requirement.type;
    return requirement;
  }
}
