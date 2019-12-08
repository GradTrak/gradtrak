import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterPaneComponent } from './semester-pane.component';

describe('SemesterPaneComponent', () => {
  let component: SemesterPaneComponent;
  let fixture: ComponentFixture<SemesterPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
