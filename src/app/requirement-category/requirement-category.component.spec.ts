import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCategoryComponent } from './requirement-category.component';

describe('RequirementCategoryComponent', () => {
  let component: RequirementCategoryComponent;
  let fixture: ComponentFixture<RequirementCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
