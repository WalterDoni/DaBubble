import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {

  selectedThreadID!: number;
  selectedChannel: any [] = [];

  constructor( private mainboard: MainboardComponent){
    this.selectedChannel = this.mainboard.selectedChannelContent;
    this.selectedThreadID = this.mainboard.hoveredChannelIndex;
    console.log(this.selectedChannel);
    
    
    
  }

  closeThread(){
    this.mainboard.toggleThread = false;
  }
}
