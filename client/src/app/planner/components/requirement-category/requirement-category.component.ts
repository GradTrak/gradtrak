import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Requirement } from '../../models/requirement.model';
import { StandaloneRequirement } from '../../models/requirements/standalone-requirement.model';
import { RequirementCategory } from '../../models/requirement-category.model';

import { ProcessedFulfillmentType } from '../../lib/process-requirements';

@Component({
  selector: 'app-requirement-category',
  templateUrl: './requirement-category.component.html',
  styleUrls: ['./requirement-category.component.scss'],
})
export class RequirementCategoryComponent implements OnInit {
  @Input() readonly requirementCategory: RequirementCategory;
  @Input() readonly manuallyFulfilled: Set<string>;
  @Input() readonly fulfillmentMap: Map<Requirement, ProcessedFulfillmentType>;
  @Output() readonly onManualFulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly onManualUnfulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly openRequirementDisplay: EventEmitter<StandaloneRequirement> = new EventEmitter<
    StandaloneRequirement
  >();

  collapsed: boolean;

  constructor() {}

  ngOnInit(): void {}

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
