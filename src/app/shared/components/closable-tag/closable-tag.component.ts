import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { StringableKeyValuePair } from '../../models/stringable-key-value-pair.model';

/** Allows to display closable tags. */
@Component({
  selector: 'shared-closable-tag',
  templateUrl: './closable-tag.component.html',
  styleUrls: ['./closable-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosableTagComponent implements OnDestroy {
  /** Subscription management. */
  private subs = new SubSink();
  /** Array contining the current list of tags. */
  private options: Array<StringableKeyValuePair<any>> = [];
  /** Array contining the current list of tags. */
  @Input() set tags(
    tags:
      | Array<StringableKeyValuePair<any>>
      | Observable<Array<StringableKeyValuePair<any>>>
  ) {
    if (!!tags) {
      if (tags instanceof Observable) {
        this.subs.sink = tags.subscribe((list) => (this.options = list));
      } else {
        this.options = tags;
      }
    }
  }
  /** Array contining the current list of tags. */
  get tags(): Array<StringableKeyValuePair<any>> {
    return this.options;
  }
  /** Emits the new list of tags on change. */
  @Output() change: EventEmitter<Array<StringableKeyValuePair<any>>> =
    new EventEmitter();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  /** Unsubscribe to avoid memory loss. */
  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Removes the tag and updates everyone on user action. */
  public closeTag(event: any) {
    // Checking the tag id
    const tagId = this.options.indexOf(event);
    // Retreives the tag name
    const toRemoveAndReturn = this.getTagWithId(tagId);
    if (toRemoveAndReturn !== undefined) {
      // Removes the tag and updates the list
      this.removeTag(toRemoveAndReturn);
      // Emits an event with the new list
      this.emitTags(this.options);
    }
  }

  /** Emits the new list of tags on change. */
  public emitTags(tags: Array<StringableKeyValuePair<any>>) {
    this.change.emit(tags);
  }

  /** Removes a tag from the list. */
  private removeTag(tagToRemove: StringableKeyValuePair<any>) {
    this.options = this.options.filter((tag) => tag !== tagToRemove);
    this.changeDetectorRef.detectChanges();
  }

  /** Get a specific tag using its id. */
  private getTagWithId(tagId: number): any {
    return this.options.splice(tagId, 1);
  }
}
