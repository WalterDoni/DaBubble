import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent implements OnInit{
  @ViewChild('inputfieldValue') inputfieldValue!: ElementRef;

  selectedThreadID!: number;
  selectedChannelTitle!: string;
  selectedChannel: any[] = [];

  firestore: Firestore = inject(Firestore);

  constructor(public mainboard: MainboardComponent) {

  }

ngOnInit(): void {
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
    let addOne = this.selectedChannel[this.selectedThreadID]['data']['answers'] + 1;
    answerFromArray.push(this.mainboard.loggedInUserName);
    let messageValue = this.inputfieldValue.nativeElement.value;
    messageArray.push(messageValue);
    let newTime = this.mainboard.getCurrentTimeInMEZ();
    timeArray.push(newTime);
    await updateDoc(doc(this.channelContentRef(), this.selectedChannel[this.selectedThreadID]['id']), {
      answerFrom: answerFromArray,
      answerText: messageArray,
      answerTime: timeArray,
      answers: addOne,
    })
    this.selectedChannel = this.mainboard.selectedChannelContent;
  }


  channelContentRef() {
    return collection(this.firestore, 'channels', this.mainboard.channelID, 'channelContent')
  }
}
