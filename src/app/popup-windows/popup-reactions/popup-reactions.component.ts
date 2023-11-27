import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-reactions',
  templateUrl: './popup-reactions.component.html',
  styleUrls: ['./popup-reactions.component.scss']
})
export class PopupReactionsComponent {

  constructor(public mainboard: MainboardComponent){}
}
