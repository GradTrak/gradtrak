import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-initializer',
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
})
export class InitializerComponent implements OnInit {
  gradYear: number;

  constructor() {
    this.gradYear = 2024;
  }

  ngOnInit(): void {}
}
