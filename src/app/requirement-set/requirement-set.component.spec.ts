import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCategoryComponent } from '../requirement-category/requirement-category.component';
import { RequirementComponent } from '../requirement/requirement.component';
import { RequirementSetComponent } from './requirement-set.component';

describe('RequirementSetComponent', () => {
  let component: RequirementSetComponent;
  let fixture: ComponentFixture<RequirementSetComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequirementCategoryComponent,
        RequirementComponent,
        RequirementSetComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSetComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    component.requirementSet = {
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
        {
          id: 'physics',
          name: 'Physics',
          requirements: [
            {
              id: 'physics7a',
              name: 'PHYSICS 7A',
            },
            {
              id: 'physics7b',
              name: 'PHYSICS 7B',
            },
          ],
        },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the RequirementSet name', () => {
    expect(compiled.querySelector('h2').textContent).toBe('College of Engineering');
  });

  it('should have an app-requirement-category for each RequirementCategory in requirementSet', () => {
    expect(compiled.querySelectorAll('app-requirement-category').length).toBe(2);
  });
});
