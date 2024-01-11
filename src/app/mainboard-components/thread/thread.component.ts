import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {
  @ViewChild('inputfieldValue') inputfieldValue!: ElementRef;

  selectedThreadID!: number;
  selectedChannelTitle!: string;
  selectedChannel: any[] = [];

  firestore: Firestore = inject(Firestore);

  constructor(public mainboard: MainboardComponent) {
    this.selectedChannel = this.mainboard.selectedChannelContent;
    this.selectedThreadID = this.mainboard.hoveredChannelIndex;
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
  }

  closeThread() {
    this.mainboard.toggleThread = false;
  }

  getImgFromAnswerUser(username: string) {
    const user = this.mainboard.userArray.find(user => user.username === username);
    return user ? user.img : '/assets/img/signup/profile.png';
  }

  async addCommentInThread() {
    let answerFromArray = this.selectedChannel[this.selectedThreadID]['data']['answerFrom'];
    let messageArray = this.selectedChannel[this.selectedThreadID]['data']['answerText'];
    let timeArray = this.selectedChannel[this.selectedThreadID]['data']['answerTime'];
    answerFromArray.push(this.mainboard.loggedInUserName);
    let messageValue = this.inputfieldValue.nativeElement.value;
    messageArray.push(messageValue);
    let newTime = this.mainboard.getCurrentTimeInMEZ();
    timeArray.push(newTime);
    await updateDoc(doc(this.channelContentRef(), this.selectedChannel[this.selectedThreadID]['id']), {
      answerFrom: answerFromArray,
      answerText: messageArray,
      answerTime: timeArray,
    })
  }

  channelContentRef() {
    return collection(this.firestore, 'channels', this.mainboard.channelID, 'channelContent')
  }
}
