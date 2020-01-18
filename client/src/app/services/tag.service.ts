import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TagPrototype } from 'common/prototypes/tag.prototype';
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
    return this.sharedTagMap.pipe(map((data: Map<string, Tag>) => Array.from(data.values())));
  }

  getTagsMap(): Observable<Map<string, Tag>> {
    if (!this.sharedTagMap) {
      this.fetchTagData();
    }
    return this.sharedTagMap;
  }

  private fetchTagData(): void {
    this.sharedTagMap = this.http.get(TagService.API_TAG_ENDPOINT).pipe(
      map((data: unknown) => Object.values(data)),
      map((data: TagPrototype[]) => data.map((tagProto: TagPrototype) => new Tag(tagProto))),
      map((data: Tag[]) => {
        const tagMap = new Map<string, Tag>();
        data.forEach((tag: Tag) => tagMap.set(tag.id, tag));
        return tagMap;
      }),
      shareReplay(),
    );
  }
}
