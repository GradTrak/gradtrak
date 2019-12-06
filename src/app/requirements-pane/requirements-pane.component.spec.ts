import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCategoryComponent } from '../requirement-category/requirement-category.component';
import { RequirementComponent } from '../requirement/requirement.component';
import { RequirementSetComponent } from '../requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './requirements-pane.component';

describe('RequirementsPaneComponent', () => {
  let component: RequirementsPaneComponent;
  let fixture: ComponentFixture<RequirementsPaneComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequirementCategoryComponent,
        RequirementComponent,
        RequirementSetComponent,
        RequirementsPaneComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsPaneComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    component.requirementSets = [
      {
        id: 'coe',
        name: 'College of Engineering',
        parent: null,
        requirementCategories: [
          {
            id: 'math',
            name: 'Math',
            requirements: [
              {
                id: 'math1a',
                name: 'MATH 1A',
              },
              {
                id: 'math1b',
                name: 'MATH 1B',
              },
            ],
          },
        ],
      },
      {
        id: 'eecs',
        name: 'EECS Major',
        parent: null,
        requirementCategories: [
          {
            id: 'eecs-lower-div',
            name: 'Lower Division Requirements',
            requirements: [
              {
                id: 'cs61a',
                name: 'CS 61A',
              },
              {
                id: 'cs61b',
                name: 'CS 61B',
              },
            ],
          },
        ],
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an app-requirement-set for each RequirementSet', () => {
    expect(compiled.querySelectorAll('app-requirement-set').length).toBe(2);
  });
});
