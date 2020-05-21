import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaneComponent } from './report-pane.component';

describe('ReportPaneComponent', () => {
  let component: ReportPaneComponent;
  let fixture: ComponentFixture<ReportPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
