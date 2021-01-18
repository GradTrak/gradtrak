import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PlannerComponent } from './planner.component';
import { SemesterPaneComponent } from './components/semester-pane/semester-pane.component';
import { SemesterComponent } from './components/semester/semester.component';
import { CourseService } from './services/course.service';
import { RequirementService } from './services/requirement.service';
import { UserService } from './services/user.service';
import { RequirementSetComponent } from './components/requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './components/requirements-pane/requirements-pane.component';
import { RequirementComponent } from './components/requirement/requirement.component';
import { RequirementCategoryComponent } from './components/requirement-category/requirement-category.component';
import { CourseSearcherComponent } from './components/course-searcher/course-searcher.component';
import { BerkeleytimeInfoComponent } from './components/berkeleytime-info/berkeleytime-info.component';
import { GoalSelectorComponent } from './components/goal-selector/goal-selector.component';
import { SemesterChangerComponent } from './components/semester-changer/semester-changer.component';
import { RequirementDisplayComponent } from './components/requirement-display/requirement-display.component';
import { LoginComponent } from './components/login/login.component';
import { ReportPaneComponent } from './components/report-pane/report-pane.component';
import { AccountEditorComponent } from './components/account-editor/account-editor.component';
import { InitializerComponent } from './components/initializer/initializer.component';

@NgModule({
  declarations: [
    PlannerComponent, //
    SemesterPaneComponent,
    SemesterComponent,
    CourseSearcherComponent,
    BerkeleytimeInfoComponent,
    GoalSelectorComponent,
    RequirementComponent,
    RequirementSetComponent,
    RequirementsPaneComponent,
    RequirementCategoryComponent,
    SemesterChangerComponent,
    RequirementDisplayComponent,
    LoginComponent,
    ReportPaneComponent,
    AccountEditorComponent,
    InitializerComponent,
  ],
  exports: [
    PlannerComponent, //
  ],
  imports: [
    CommonModule, //
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    CourseService, //
    RequirementService,
    UserService,
  ],
})
export class PlannerModule {}
