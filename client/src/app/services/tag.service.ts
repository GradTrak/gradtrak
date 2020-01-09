/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Tag } from 'models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  /* eslint-disable @typescript-eslint/camelcase */
  DUMMY_TAG_DATA: any = {
    upper_div: {
      id: 'upper_div',
      name: 'Upper Division Course',
    },
    ac: {
      id: 'ac',
      name: 'American Cultures',
    },
    rc_a: {
      id: 'rc_a',
      name: 'Reading and Composition Part A',
    },
    rc_b: {
      id: 'rc_b',
      name: 'Reading and Composition Part B',
    },
    ls_arts: {
      id: 'ls_arts',
      name: 'L&S Arts and Literature',
    },
    ls_bio: {
      id: 'ls_bio',
      name: 'L&S Biological Science',
    },
    ls_hist: {
      id: 'ls_hist',
      name: 'L&S Historical Studies',
    },
    ls_inter: {
      id: 'ls_inter',
      name: 'L&S International Studies',
    },
    ls_philo: {
      id: 'ls_philo',
      name: 'L&S Philosophy and Values',
    },
    ls_phys: {
      id: 'ls_phys',
      name: 'L&S Physical Science',
    },
    ls_socio: {
      id: 'ls_socio',
      name: 'L&S Social and Behavioral Sciences',
    },
    eecs_ethics: {
      id: 'eecs_ethics',
      name: 'EECS Ethics Course',
    },
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

  private sharedTagMap: Observable<Map<string, Tag>>;

  constructor() {}

  getTags(): Observable<Tag[]> {
    if (!this.sharedTagMap) {
      this.fetchTagData();
    }
    return this.sharedTagMap.pipe(map((data: any) => Array.from(data.values())));
  }

  getTagsMap(): Observable<Map<string, Tag>> {
    if (!this.sharedTagMap) {
      this.fetchTagData();
    }
    return this.sharedTagMap;
  }

  private fetchTagData(): void {
    this.sharedTagMap = of(this.DUMMY_TAG_DATA).pipe(
      map((data: any) => new Map<string, any>(Object.entries(data))),
      map(this.instantiateTags),
      shareReplay(),
    );
  }

  private instantiateTags(data: Map<string, any>): Map<string, Tag> {
    data.forEach((rawTag: any, key: string) => {
      data.set(key, new Tag(rawTag));
    });
    return data;
  }
}
