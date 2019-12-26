import { Component, Input, OnInit } from '@angular/core';
import { Requirement } from 'models/requirement.model';

@Component({
  selector: '[app-requirement]',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss', '../requirement-category.component.scss'],
}) // I'm also not too sure why there's two stylesheets here.
export class RequirementComponent implements OnInit {
  @Input() requirement: Requirement;

  constructor() {}

  ngOnInit(): void {}
}
