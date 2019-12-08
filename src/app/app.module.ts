import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequirementComponent } from './requirement/requirement.component';
import { RequirementSetComponent } from './requirement-set/requirement-set.component';
import { RequirementsPaneComponent } from './requirements-pane/requirements-pane.component';
import { RequirementCategoryComponent } from './requirement-category/requirement-category.component';

@NgModule({
  declarations: [
    AppComponent,
    RequirementComponent,
    RequirementSetComponent,
    RequirementsPaneComponent,
    RequirementCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
