import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSetComponent } from './requirement-set.component';

describe('RequirementSetComponent', () => {
  let component: RequirementSetComponent;
  let fixture: ComponentFixture<RequirementSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementSetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
