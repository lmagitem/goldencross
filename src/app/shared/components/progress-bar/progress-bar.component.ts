import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/services/progress-bar/progress-bar.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'shared-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  private subs: SubSink = new SubSink();
  animated = false;
  value = 100;
  striped = false;
  type = 'dark';
  text = 'Nothing to see here';

  constructor(private progressBarService: ProgressBarService) {}

  ngOnInit(): void {
    this.subs.sink = this.progressBarService.content$.subscribe((content) => {
      this.animated = content.animated;
      this.value = content.value;
      this.striped = content.striped;
      this.type = content.type;
      this.text = content.text;
    });
  }
}
