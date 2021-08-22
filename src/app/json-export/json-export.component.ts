import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-export',
  templateUrl: './json-export.component.html',
  styleUrls: ['./json-export.component.scss'],
})
export class JsonExportComponent implements OnInit {
  jsonContent = '{}';

  constructor() {}

  ngOnInit(): void {}
}
