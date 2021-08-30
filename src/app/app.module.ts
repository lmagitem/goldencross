import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { MainComponent } from './components/main/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortableHeaderDirective } from './shared/directives/sortable-header.directive';
import { JsonExportComponent } from './components/json-export/json-export.component';
import { ResultsDisplayComponent } from './components/results-display/results-display.component';
import { RuleEditorComponent } from './components/rule-editor/rule-editor.component';
import { ClosableTagComponent } from './shared/components/closable-tag/closable-tag.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    ResultsDisplayComponent,
    JsonExportComponent,
    MainComponent,
    RuleEditorComponent,
    ClosableTagComponent,
    ConfirmModalComponent,
    SortableHeaderDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
