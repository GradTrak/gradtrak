import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterChangerComponent } from './semester-changer.component';

describe('SemesterChangerComponent', () => {
  let component: SemesterChangerComponent;
  let fixture: ComponentFixture<SemesterChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
