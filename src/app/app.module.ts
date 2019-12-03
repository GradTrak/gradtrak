import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequirementComponent } from './requirement/requirement.component';
import { RequirementSetComponent } from './requirement-set/requirement-set.component';

@NgModule({
  declarations: [
    AppComponent,
    RequirementComponent,
    RequirementSetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
