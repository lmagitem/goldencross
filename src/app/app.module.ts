import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { MainComponent } from './components/main/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortableHeader } from './shared/directives/sortable-header.directive';
import { JsonExportComponent } from './components/json-export/json-export.component';
import { ResultsDisplayComponent } from './components/results-display/results-display.component';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    ResultsDisplayComponent,
    JsonExportComponent,
    MainComponent,
    SortableHeader,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
