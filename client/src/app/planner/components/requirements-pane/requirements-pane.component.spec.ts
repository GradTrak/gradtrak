import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsPaneComponent } from './requirements-pane.component';

describe('RequirementsPaneComponent', () => {
  let component: RequirementsPaneComponent;
  let fixture: ComponentFixture<RequirementsPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementsPaneComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
