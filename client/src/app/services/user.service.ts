import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Semester } from 'models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static readonly SEMESTER_API_ENDPOINT = '/api/user';

  // FIXME Create interface for user data
  private sharedUserData: Observable<any>;

  constructor(private http: HttpClient) {}

  getUserData(): Observable<any> {
    if (!this.sharedUserData) {
      this.fetchUserData();
    }
    return this.sharedUserData;
  }

  private fetchUserData(): void {
    this.sharedUserData = this.http.get(UserService.SEMESTER_API_ENDPOINT).pipe(
      map((data: any) => {
        return { ...data, semesters: this.instantiateSemesters(data.semesters) };
      }),
      map((data: any) => {
        return { ...data, semesters: Object.values(data.semesters) };
      }),
      shareReplay(),
    );
  }

  private instantiateSemesters(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Semester(data[key]);
    });
    return data;
  }
}
