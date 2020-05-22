import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'models/course.model';
import { RequirementCategory } from 'models/requirement-category.model';

@Component({
  selector: 'app-requirement-category',
  templateUrl: './requirement-category.component.html',
  styleUrls: ['./requirement-category.component.scss'],
})
export class RequirementCategoryComponent implements OnInit {
  @Input() readonly requirementCategory: RequirementCategory;
  @Input() readonly courses: Course[];

  collapsed: boolean;

  constructor() {
    this.collapsed = false;
  }

  ngOnInit(): void {}

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
