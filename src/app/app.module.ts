import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SemesterPaneComponent } from './semester-pane/semester-pane.component';
import { SemesterComponent } from './semester-pane/semester/semester.component';
import { CourseService } from './services/course.service';
import { RequirementService } from './services/requirement.service';
import { SemesterService } from './services/semester.service';
import { CourseAdderComponent } from './course-adder/course-adder.component';
import { RequirementComponent } from './requirement/requirement.component';
import { RequirementSetComponent } from './requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './requirements-pane/requirements-pane.component';
import { RequirementCategoryComponent } from './requirement-category/requirement-category.component';

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
