import { Component, OnInit, Input} from '@angular/core';
import {Course} from '../../course'

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css']
})
export class SemesterComponent implements OnInit {
  @Input() name: string;
  @Input() semester: Semester;

  constructor() { }

  ngOnInit() {
  }

}
