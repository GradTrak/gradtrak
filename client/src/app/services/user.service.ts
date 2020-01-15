import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Semester } from 'models/semester.model';
import { RequirementSet } from 'models/requirement-set.model'

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

  saveUserData(semesters:Semester[] = null, goals: RequirementSet[] = null): void{
    const sentData = {};
    if (! (semesters === null)){sentData['semesters'] = semesters}
    if (! (goals === null)){sentData['goals'] = goals} //is sendData[goals] preferred over sentData.goals? or vice versa?
    console.log('the object', sentData, 'is being saved')
    this.http.post(UserService.SEMESTER_API_ENDPOINT, sentData)
  }

  /**
  * Fetches the user data from the backend, instantiates the semesters,
  * and takes the object and make it a list
  */
  //Why does semesters need to be stored as an object anyway if we're just going to take it apart?
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
