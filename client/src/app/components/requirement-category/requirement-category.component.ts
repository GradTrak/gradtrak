import { Component, Input, OnInit } from '@angular/core';
import { RequirementCategory } from 'models/requirement-category.model';

@Component({
  selector: 'app-requirement-category',
  templateUrl: './requirement-category.component.html',
  styleUrls: ['./requirement-category.component.css'],
})
export class RequirementCategoryComponent implements OnInit {
  @Input() requirementCategory: RequirementCategory;

  constructor() {}

  ngOnInit(): void {}
}
