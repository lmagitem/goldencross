import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { ResultsDisplayComponent } from './results-display/results-display.component';
import { JsonExportComponent } from './json-export/json-export.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortableHeader } from './shared/directives/sortable-header.directive';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    ResultsDisplayComponent,
    JsonExportComponent,
    CalculatorComponent,
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
