import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import { RequirementSet } from 'models/requirement-set.model';
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
      flatMap((data: RequirementSetPrototype[]) => this.prepareRequirements(data)),
      shareReplay(),
    );
  }

  private prepareRequirements(data: RequirementSetPrototype[]): Observable<Map<string, RequirementSet>> {
    return forkJoin({
      coursesMap: this.courseService.getCoursesMap(),
      tagsMap: this.tagService.getTagsMap(),
    }).pipe(
      map(({ coursesMap, tagsMap }) => {
        const reqSetMap = new Map<string, RequirementSet>();

        let lastSize;
        while (reqSetMap.size < data.length) {
          lastSize = reqSetMap.size;

          // Only set prototypes whose parent IDs are contained within reqSetMap but not their own IDs
          const reqSetIds = [...reqSetMap.values()].map((reqSet: RequirementSet) => reqSet.id);
          data
            .filter(
              (reqSetProto: RequirementSetPrototype) =>
                !reqSetProto.parentId || reqSetIds.some((reqSetId: string) => reqSetId === reqSetProto.parentId),
            )
            .map(
              (reqSetProto: RequirementSetPrototype) => new RequirementSet(reqSetProto, reqSetMap, coursesMap, tagsMap),
            )
            .forEach((reqSet: RequirementSet) => reqSetMap.set(reqSet.id, reqSet));

          // If size did not grow, we know there are orphans
          if (lastSize === reqSetMap.size) {
            let error = 'RequirementSets exist with orphaned parents:';
            const reqIds = [...reqSetMap.values()].map((reqSet: RequirementSet) => reqSet.id);
            data
              .filter((reqSetProto: RequirementSetPrototype) => !reqIds.includes(reqSetProto.id))
              .forEach((orphanProto: RequirementSetPrototype) => {
                error += `\n${orphanProto.id} with parent ${orphanProto.parentId}`;
              });
            console.error(error);
            break;
          }
        }

        return reqSetMap;
      }),
    );
  }
}
