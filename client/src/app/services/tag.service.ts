/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Tag } from 'models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private static readonly API_TAG_ENDPOINT = '/api/tags';

  private sharedTagMap: Observable<Map<string, Tag>>;

  constructor(private http: HttpClient) {}

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
    this.sharedTagMap = this.http.get(TagService.API_TAG_ENDPOINT).pipe(
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
