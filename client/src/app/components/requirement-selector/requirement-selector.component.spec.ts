import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSelectorComponent } from './requirement-selector.component';

describe('RequirementSelectorComponent', () => {
  let component: RequirementSelectorComponent;
  let fixture: ComponentFixture<RequirementSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
