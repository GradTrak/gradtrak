import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SemesterPaneComponent } from './components/semester-pane/semester-pane.component';
import { SemesterComponent } from './components/semester-pane/semester/semester.component';
import { CourseService } from './services/course.service';
import { RequirementService } from './services/requirement.service';
import { SemesterService } from './services/semester.service';
import { CourseAdderComponent } from './components/semester-pane/semester/course-adder/course-adder.component';
import { RequirementSetComponent } from './components/requirements-pane/requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './components/requirements-pane/requirements-pane.component';
import { RequirementComponent } from './components/requirements-pane/requirement-set/requirement-category/requirement/requirement.component';
import { RequirementCategoryComponent } from './components/requirements-pane/requirement-set/requirement-category/requirement-category.component'

@NgModule({
  declarations: [
    AppComponent,
    SemesterPaneComponent,
    SemesterComponent,
    CourseAdderComponent,
    RequirementComponent,
    RequirementSetComponent,
    RequirementsPaneComponent,
    RequirementCategoryComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, FormsModule, NgbModule],
  providers: [CourseService, RequirementService, SemesterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
