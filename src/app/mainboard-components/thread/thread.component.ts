import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent implements OnInit {
  @ViewChild('inputfieldValue') inputfieldValue!: ElementRef;

  selectedThreadID!: number;
  selectedChannelTitle!: string;

  firestore: Firestore = inject(Firestore);

  constructor(public mainboard: MainboardComponent) {

  }

  ngOnInit(): void {
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

  /**
  * Gets the current time in Central European Time (MEZ/CEST).
  * @returns {string} The current time formatted as 'HH:mm' in the Europe/Berlin time zone.
  */
  getCurrentTimeInMEZ() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Berlin',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    };
    return now.toLocaleTimeString('de-DE', options);
  }

  async addCommentInThread() {
    let answerFromArray = this.mainboard.selectedChannelContent[this.selectedThreadID]['data']['answerFrom'];
    let messageArray = this.mainboard.selectedChannelContent[this.selectedThreadID]['data']['answerText'];
    let timeArray = this.mainboard.selectedChannelContent[this.selectedThreadID]['data']['answerTime'];
    let addOne = this.mainboard.selectedChannelContent[this.selectedThreadID]['data']['answers'] + 1;
    answerFromArray.push(this.mainboard.loggedInUserName);
    let messageValue = this.inputfieldValue.nativeElement.value;
    messageArray.push(messageValue);
    let newTime = this.getCurrentTimeInMEZ();
    timeArray.push(newTime);
    await updateDoc(doc(this.channelContentRef(), this.mainboard.selectedChannelContent[this.selectedThreadID]['id']), {
      answerFrom: answerFromArray,
      answerText: messageArray,
      answerTime: timeArray,
      answers: addOne,
    })
  }


  channelContentRef() {
    return collection(this.firestore, 'channels', this.mainboard.channelID, 'channelContent')
  }
}
