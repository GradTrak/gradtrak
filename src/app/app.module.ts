import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SemesterService } from './semester-pane/semester.service'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SemesterPaneComponent } from './semester-pane/semester-pane.component';
import { SemesterComponent } from './semester-pane/semester/semester.component';
import { CourseService } from './course.service';
import { CourseAdderComponent } from './course-adder/course-adder.component'

@NgModule({
  declarations: [
    AppComponent,
    SemesterPaneComponent,
    SemesterComponent,
    CourseAdderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NgbModule
  ],
  providers: [CourseService, SemesterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
