import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditorComponent } from './account-editor.component';

describe('AccountEditorComponent', () => {
  let component: AccountEditorComponent;
  let fixture: ComponentFixture<AccountEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
