import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Semester } from '../../semester';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit {
  @Input() name: string;
  @Input() semester: Semester;

  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {}
}
