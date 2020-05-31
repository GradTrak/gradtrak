import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-initializer',
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
})
export class InitializerComponent implements OnInit {
  //@Output
  gradYear: number;

  constructor() {
    this.gradYear = 2024;
  }

  ngOnInit(): void {}

  submit(): void {

  }
}
