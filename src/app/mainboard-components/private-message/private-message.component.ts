import { Component, ElementRef, inject, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, updateDoc, doc } from '@angular/fire/firestore';
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
    this.messageTextArray.push(input);
    this.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.messageTimeArray.push(timestamp);
    await updateDoc(doc(this.privateChannelRef(), this.channelId), {
      messageFrom: this.messageFromArray,
      messageText: this.messageTextArray,
      messageTime: this.messageTimeArray,
    });
    this.newCommentValue.nativeElement.value = '';
  }


  //----Create-Arrays----//
  getMessageFromArray() {
    this.messageFromArray = [];
    this.privateChannelArray[0].messageFrom.forEach((list: any) => {
      this.messageFromArray.push(list)
      });;
  }

  getmessageTextArrayArray() {
    this.messageTextArray = [];
    this.privateChannelArray[0].messageText.forEach((list: any) => {
      this.messageTextArray.push(list)
    }); 
  }

  getmessageTimeArray() {
    this.messageTimeArray = [];
    this.privateChannelArray[0].messageTime.forEach((list: any) => {
        this.messageTimeArray.push(list)
      });
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
        this.channelId = element.id;
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
}
