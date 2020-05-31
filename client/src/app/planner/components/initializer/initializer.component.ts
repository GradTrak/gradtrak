import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequirementSet } from '../../models/requirement-set.model';
import { UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-initializer',
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
})
export class InitializerComponent implements OnInit {
  @Output initializeData: EventEmitter<UserData>;
  startYear: number;
  gradYear: number;
  summer: boolean;
  state: 'semesters' | 'goals';

  constructor() {
    this.state = 'semesters';
  }

  ngOnInit(): void {}

  next(): void {
    this.state = 'goals';
  }

  submit(reqSets: RequirementSet[]): void {

  }
}
