import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { Requirement } from '../../models/requirement.model';
import { RequirementSet } from '../../models/requirement-set.model';
import { UserService } from '../../services/user.service';

import { ProcessedFulfillmentType } from '../../lib/process-requirements';

@Component({
  selector: 'app-requirement-set',
  templateUrl: './requirement-set.component.html',
  styleUrls: ['./requirement-set.component.scss'],
})
export class RequirementSetComponent implements OnInit {
  @Input() readonly requirementSet: RequirementSet;
  @Input() readonly courses: Course[];
  @Input() readonly manuallyFulfilled: Map<string, Set<string>>;
  @Input() readonly fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;

  collapsed: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  manuallyFulfill(requirement: Requirement): void {
    this.userService.manuallyFulfill(requirement, this.requirementSet);
  }

  manuallyUnfulfill(requirement: Requirement): void {
    this.userService.manuallyUnfulfill(requirement, this.requirementSet);
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
