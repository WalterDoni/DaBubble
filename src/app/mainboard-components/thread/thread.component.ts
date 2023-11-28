import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {

  selectedThreadID!: number;
  selectedChannelTitle!: string;
  selectedChannel: any [] = [];

  constructor( private mainboard: MainboardComponent){
    
    this.selectedChannel = this.mainboard.selectedChannelContent;
    this.selectedThreadID = this.mainboard.hoveredChannelIndex;
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
  }

  closeThread(){
    this.mainboard.toggleThread = false;
  }
}
