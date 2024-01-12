// popup-reactions.component.ts
import { Component, Input } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-reactions',
  templateUrl: './popup-reactions.component.html',
  styleUrls: ['./popup-reactions.component.scss']
})
export class PopupReactionsComponent {
  @Input() emojiIndex!: number;
  @Input() channelIndex!: number 

  constructor(public mainboard: MainboardComponent) {}

}