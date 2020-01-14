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

  private sharedTagData: Observable<object>;

  constructor(private http: HttpClient) {}

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

  private fetchTagData(): void {
    this.sharedTagData = this.http.get(TagService.API_TAG_ENDPOINT).pipe(map(this.instantiateTags), shareReplay());
  }

  private instantiateTags(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Tag(data[key]);
    });
    return data;
  }
}
