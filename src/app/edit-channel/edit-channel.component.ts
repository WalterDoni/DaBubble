import { Component } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {

  constructor(public mainboard: MainboardComponent){

  }

  hideEditChannel(event: Event){
    event.stopPropagation();
    this.mainboard.toggleEditChannel = false;
    this.mainboard.toggleBackground = false;

  }

}
