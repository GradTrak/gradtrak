import { Component, OnInit } from '@angular/core';
import { Requirement } from '../requirement';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit {
  requirement: Requirement = {
    id: 'eecs',
    name: 'EECS Major Requirements',
  }

  constructor() { }

  ngOnInit() {
  }

}
