import { Component, OnInit, Input} from '@angular/core';
import {Semester} from '../semester';
import {Course} from '../course';
import {CourseService} from '../course.service';
import {SemesterService} from './semester.service'

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  test = "string";
  //TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  semesterList: Semester[] = [];

  constructor(private _courseService : CourseService, private _semesterService:SemesterService) {
  };

  ngOnInit() {
    this.semesterList = this._semesterService.getSemesters();
    this.semesterList[0].courses.push(this.semesterList[0].courses[0])
    this.semesterList = this._semesterService.getSemesters();
    //this.test = this.semesterList[1].courses[0].id
  };

}
