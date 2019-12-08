import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAdderComponent } from './course-adder.component';

describe('CourseAdderComponent', () => {
  let component: CourseAdderComponent;
  let fixture: ComponentFixture<CourseAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
