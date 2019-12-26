import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementComponent } from 'components/requirement-category/requirement/requirement.component';
import { RequirementCategoryComponent } from './requirement-category.component';

describe('RequirementCategoryComponent', () => {
  let component: RequirementCategoryComponent;
  let fixture: ComponentFixture<RequirementCategoryComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementCategoryComponent, RequirementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementCategoryComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    component.requirementCategory = {
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
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the category name', () => {
    expect(compiled.querySelector('thead th').textContent).toContain('Math');
  });

  it('should have two class rows', () => {
    expect(compiled.querySelectorAll('tbody tr[app-requirement]').length).toBe(2);
  });
});
