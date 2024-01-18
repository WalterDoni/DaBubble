import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-private-message-content',
  templateUrl: './private-message-content.component.html',
  styleUrls: ['./private-message-content.component.scss']
})
export class PrivateMessageContentComponent {

  constructor(public mainboard: MainboardComponent){}

}
