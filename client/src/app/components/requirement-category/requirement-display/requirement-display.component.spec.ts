import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDisplayComponent } from './requirement-display.component';

describe('RequirementDisplayComponent', () => {
  let component: RequirementDisplayComponent;
  let fixture: ComponentFixture<RequirementDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
