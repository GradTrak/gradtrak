import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlannerModule } from './planner/planner.module';

@NgModule({
  declarations: [
    AppComponent, //
  ],
  imports: [
    AppRoutingModule, //
    BrowserModule,
    PlannerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
