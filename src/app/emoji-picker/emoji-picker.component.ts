import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {  Subject } from 'rxjs';
import { MainboardComponent } from '../mainboard/mainboard.component';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent {
  isOpened = false;

  @Input() emojiInput$: Subject<string> | undefined;
  @ViewChild("container") container: ElementRef<HTMLElement> | undefined;

  constructor(private mainboard: MainboardComponent) {
  }

  emojiSelected(event: any) {
    const selectedEmoji = event.emoji.native;
    const test = event.emoji.colons;
    this.emojiInput$?.next(test);
    this.mainboard.reactionEmoji = selectedEmoji;
  }

  eventHandler = (event: Event) => {
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      this.isOpened = false;
      window.removeEventListener("click", this.eventHandler);
    }
  };

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
