import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MainboardComponent } from '../mainboard/mainboard.component';
import { ThreadComponent } from '../mainboard-components/thread/thread.component';

@Component({
  selector: 'app-emoji-picker-thread',
  templateUrl: './emoji-picker-thread.component.html',
  styleUrls: ['./emoji-picker-thread.component.scss']
})
export class EmojiPickerThreadComponent {
  isOpened = false;

  @Input() emojiInput$: Subject<string> | undefined;
  @ViewChild("container") container: ElementRef<HTMLElement> | undefined;

  constructor(private thread: ThreadComponent) {
  }

  /**
 * Handles the selection of an emoji.
 */
  emojiSelected(event: any) {
    const selectedEmoji = event.emoji.native;
    this.emojiInput$?.next(selectedEmoji);
    this.thread.inputfieldValue.nativeElement.value += selectedEmoji;
  }

  /**
 * Handles the click event to check if it occurs outside the container.
 * Closes the container if the click is outside.
 *
 */
  eventHandler = (event: Event) => {
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      this.isOpened = false;
      window.removeEventListener("click", this.eventHandler);
    }
  };

  /**
 * Toggles the opened/closed state of the container and adds or removes the event handler accordingly.
 *
 */
  toggled() {
    if (!this.container) {
      return;
    }
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener("click", this.eventHandler);
    } else {
      window.removeEventListener("click", this.eventHandler);
    }
  }

}
