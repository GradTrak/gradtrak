import { Component, Input, OnInit } from '@angular/core';
import { RequirementCategory } from '../requirement-category';

@Component({
  selector: 'app-requirement-category',
  templateUrl: './requirement-category.component.html',
  styleUrls: ['./requirement-category.component.css'],
})
export class RequirementCategoryComponent implements OnInit {
  @Input() requirementCategory: RequirementCategory;

  constructor() {}

  ngOnInit() {}
}
