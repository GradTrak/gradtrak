import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSearcherComponent } from './course-searcher.component';

describe('CourseSearcherComponent', () => {
  let component: CourseSearcherComponent;
  let fixture: ComponentFixture<CourseSearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseSearcherComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
