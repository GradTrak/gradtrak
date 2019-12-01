import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SemesterPaneComponent } from './semester-pane/semester-pane.component';
import { SemesterComponent } from './semester-pane/semester/semester.component';
import { CourseRowComponent } from './semester-pane/semester/course-row/course-row.component';

@NgModule({
  declarations: [
    AppComponent,
    SemesterPaneComponent,
    SemesterComponent,
    CourseRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
