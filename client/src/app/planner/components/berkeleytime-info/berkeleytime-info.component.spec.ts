import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkeleytimeInfoComponent } from './berkeleytime-info.component';

describe('BerkeleytimeInfoComponent', () => {
  let component: BerkeleytimeInfoComponent;
  let fixture: ComponentFixture<BerkeleytimeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BerkeleytimeInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerkeleytimeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
