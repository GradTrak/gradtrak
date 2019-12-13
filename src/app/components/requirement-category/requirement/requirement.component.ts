import { Component, Input, OnInit } from '@angular/core';
import { Requirement } from 'models/requirement.model';

@Component({
  selector: '[app-requirement]',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css'],
})
export class RequirementComponent implements OnInit {
  @Input() requirement: Requirement;

  constructor() {}

  ngOnInit(): void {}
}
