import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Tag } from 'models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  /* eslint-disable @typescript-eslint/camelcase */
  DUMMY_TAG_DATA: object = {
    eecs_upper_div: {
      id: 'eecs_upper_div',
      name: 'EECS Upper Division Course',
    },
    linguis_elective: {
      id: 'linguis_elective',
      name: 'Linguistics Elective',
    },
  };
  /* eslint-enable @typescript-eslint/camelcase */

  private sharedTagData: Observable<object>;

  constructor() {}

  getTags(): Observable<Tag[]> {
    if (!this.sharedTagData) {
      this.fetchTagData();
    }
    return this.sharedTagData.pipe(map(Object.values));
  }

  getTagsObj(): Observable<object> {
    if (!this.sharedTagData) {
      this.fetchTagData();
    }
    return this.sharedTagData;
  }

  fetchTagData(): void {
    this.sharedTagData = of(this.DUMMY_TAG_DATA).pipe(map(this.instantiateTags), shareReplay());
  }

  private instantiateTags(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Tag(data[key]);
    });
    return data;
  }
}
