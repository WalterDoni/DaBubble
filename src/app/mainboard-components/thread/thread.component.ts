import { Component } from '@angular/core';
import { debugErrorMap } from '@angular/fire/auth';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {

  selectedThreadID!: number;
  selectedChannelTitle!: string;
  selectedChannel: any[] = [];
  selectedChannelContent: any[] = [];

  constructor(private mainboard: MainboardComponent) {
    this.selectedChannel = this.mainboard.selectedChannelContent;
    this.selectedThreadID = this.mainboard.hoveredChannelIndex;
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
    this.selectedChannelContent = this.mainboard.selectedChannelContent;
  }

  closeThread() {
    this.mainboard.toggleThread = false;
  }

  getImgFromAnswerUser(username: string) {
    const user = this.mainboard.userArray.find(user => user.username === username);
    return user ? user.img : '/assets/img/signup/profile.png';
  }

}
