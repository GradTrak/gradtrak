import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SemesterPaneComponent } from './components/semester-pane/semester-pane.component';
import { SemesterComponent } from './components/semester/semester.component';
import { CourseService } from './services/course.service';
import { RequirementService } from './services/requirement.service';
import { SemesterService } from './services/semester.service';
import { RequirementSetComponent } from './components/requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './components/requirements-pane/requirements-pane.component';
import { RequirementComponent } from './components/requirement-category/requirement/requirement.component';
import { RequirementCategoryComponent } from './components/requirement-category/requirement-category.component';
import { CourseSearcherComponent } from './components/course-searcher/course-searcher.component';
import { GoalSelectorComponent } from './components/goal-selector/goal-selector.component';
import { SemesterChangerComponent } from './components/semester-changer/semester-changer.component';
import { RequirementDisplayComponent } from './components/requirement-category/requirement-display/requirement-display.component';

@NgModule({
  declarations: [
    AppComponent,
    SemesterPaneComponent,
    SemesterComponent,
    CourseSearcherComponent,
    GoalSelectorComponent,
    RequirementComponent,
    RequirementSetComponent,
    RequirementsPaneComponent,
    RequirementCategoryComponent,
    SemesterChangerComponent,
    RequirementDisplayComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, FormsModule, NgbModule],
  providers: [CourseService, RequirementService, SemesterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
