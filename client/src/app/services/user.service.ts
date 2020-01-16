/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
import { UserData } from 'models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static readonly SEMESTER_API_ENDPOINT = '/api/user';

  private sharedUserData: Observable<UserData>;

  constructor(private http: HttpClient) {}

  getUserData(): Observable<UserData> {
    if (!this.sharedUserData) {
      this.fetchUserData();
    }
    return this.sharedUserData;
  }

  saveUserData(semesters: Semester[], goals: RequirementSet[]): void {
    const sentData = {
      semesters,
      goals,
    };
    this.http.post(UserService.SEMESTER_API_ENDPOINT, sentData).subscribe();
  }

  /**
   * Fetches the user data from the backend, instantiates the semesters, and takes the object and make it a list.
   */
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
