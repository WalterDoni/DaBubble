import { Component, ElementRef, inject, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';


@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent implements OnChanges {
  @ViewChild('newCommentValue') newCommentValue!: ElementRef;
  channelId!: string;

  privateChannelArray: any[] = [];
  messageFromArray: any[] = [];
  messageTextArray: any[] = [];
  messageTimeArray: any[] = [];
  firestore: Firestore = inject(Firestore);
  unsubprivateChannel;

  constructor(public mainboard: MainboardComponent) {
    this.unsubprivateChannel = this.subprivateChannel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger
    if (changes[this.mainboard.selectedUserDirectMessageName] && changes[this.mainboard.selectedUserDirectMessageName].currentValue) {
      this.getPrivateChannelId();
    }
  }

  getPrivateChannelId() {
    if (this.mainboard.loggedInUserName == this.privateChannelArray[0]['member1'] || this.privateChannelArray[0]['member2'] && this.mainboard.selectedUserDirectMessageName == this.privateChannelArray[0]['member1'] || this.privateChannelArray[0]['member2'])
      console.log(this.privateChannelArray[0]['privateChannelId']);
  }

  //----Add-New-Message----//

  async newCommentInSelectedPrivateChannel() {
    let input = this.newCommentValue.nativeElement.value;
    let message = this.messageTextArray.push(input);
    let from = this.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    let time = this.messageTimeArray.push(timestamp);
    debugger
    await addDoc(this.privateChannelContentRef(), {
      messageFrom: from,
      messageText: message,
      messageTime: time,
    });
    this.newCommentValue.nativeElement.value = '';
  }
  

  //----Create-Arrays----//
  getMessageFromArray() {
    this.privateChannelArray.forEach(element => {
      element.messageFrom.forEach((list: any) => {
        this.messageFromArray.push(list)
      });
    });
    console.log(this.messageFromArray);
  }

  getmessageTextArrayArray() {
    this.privateChannelArray.forEach(element => {
      element.messageText.forEach((list: any) => {
        this.messageTextArray.push(list)
      });
    });
    console.log(this.messageTextArray);
  }

  getmessageTimeArray() {
    this.privateChannelArray.forEach(element => {
      element.messageTime.forEach((list: any) => {
        this.messageTimeArray.push(list)
      });
    });
    console.log(this.messageTimeArray);
  }

  //----Subscribe-Functions----//

  subprivateChannel() {
    return onSnapshot(this.privateChannelRef(), (list) => {
      this.privateChannelArray = [];
      list.forEach(element => {
        this.privateChannelArray.push({
          privateMessageFromUser: element.data()['privateMessageFromUser'],
          privateMessageToUser: element.data()['privateMessageToUser'],
          messageFrom: element.data()['messageFrom'],
          messageText: element.data()['messageText'],
          messageTime: element.data()['messageTime'],
          privateChannelId: element.id,
        })
      })
      console.log(this.privateChannelArray);
      this.getPrivateChannelId();
      this.getMessageFromArray();
      this.getmessageTextArrayArray();
      this.getmessageTimeArray();
    })
  }

  privateChannelRef() {
    return collection(this.firestore, 'private-channels')
  }

  privateChannelContentRef() {
    return collection(this.firestore, 'private-channels', this.channelId)
  }
}
