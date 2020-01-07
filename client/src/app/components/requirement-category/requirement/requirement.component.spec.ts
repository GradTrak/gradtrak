import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementComponent } from './requirement.component';

describe('RequirementComponent', () => {
  let component: RequirementComponent;
  let fixture: ComponentFixture<RequirementComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    component.requirement = {
      id: 'math1a',
      name: 'MATH 1A',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the Requirement name', () => {
    expect(
      Array.prototype.slice
        .call(compiled.querySelectorAll('td'))
        .map((elem) => elem.textContent)
        .some((text) => text.includes('MATH 1A')),
    ).toBe(true);
  });
});
