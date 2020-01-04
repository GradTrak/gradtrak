import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RequirementCategoryComponent } from 'components/requirement-category/requirement-category.component';
import { RequirementComponent } from 'components/requirement-category/requirement/requirement.component';
import { RequirementSetComponent } from 'components/requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from 'components/requirements-pane/requirements-pane.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        RequirementCategoryComponent,
        RequirementComponent,
        RequirementSetComponent,
        RequirementsPaneComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'gradtrak'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('gradtrak');
  });
});
