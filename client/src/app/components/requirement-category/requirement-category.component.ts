import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { RequirementCategory } from 'models/requirement-category.model';

@Component({
  selector: 'app-requirement-category',
  templateUrl: './requirement-category.component.html',
  styleUrls: ['./requirement-category.component.scss'],
})
export class RequirementCategoryComponent implements OnInit {
  @Input() readonly requirementCategory: RequirementCategory;
  @Input() readonly courses: Course[];
  @Input() readonly manuallyFulfilled: string[];
  @Output() readonly onManualFulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();
  @Output() readonly onManualUnfulfill: EventEmitter<Requirement> = new EventEmitter<Requirement>();

  constructor() {}

  ngOnInit(): void {}
}
