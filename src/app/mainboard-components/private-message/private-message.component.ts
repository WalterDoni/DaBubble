import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, updateDoc, doc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';


@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent {
  @ViewChild('newCommentValue') newCommentValue!: ElementRef;
  channelId!: string;

  privateChannelArray: any[] = [];
  messageFromArray: any[] = [];
  messageTextArray: any[] = [];
  messageTimeArray: any[] = [];
  firestore: Firestore = inject(Firestore);
  unsubprivateChannel;

  constructor(public mainboard: MainboardComponent,private cdr: ChangeDetectorRef) {
    this.unsubprivateChannel = this.subprivateChannel();
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

  //----Get the current ID----//

  getSelectedPrivateChannelId() {
    for (let i = 0; i < this.privateChannelArray.length; i++) {
      const channel = this.privateChannelArray[i];
      if (channel.privateMessageFromUser == this.mainboard.loggedInUserName && channel.privateMessageToUser == this.mainboard.selectedUserDirectMessageName) {
        this.channelId = channel.id;
        this.getMessageFromArray(i);
        this.getmessageTextArrayArray(i);
        this.getmessageTimeArray(i);
      
        break;
      } else {
        this.clearArrays();
      }
    }
  }

  clearArrays() {
    this.messageFromArray = [];
    this.messageTextArray = [];
    this.messageTimeArray = [];
  }

  //----Create-Arrays----//
  getMessageFromArray(index: number) {
    this.messageFromArray = [];
    this.privateChannelArray[index].messageFrom.forEach((list: any) => {
      this.messageFromArray.push(list)
    });
  }

  getmessageTextArrayArray(index: number) {
    this.messageTextArray = [];
    this.privateChannelArray[index].messageText.forEach((list: any) => {
      this.messageTextArray.push(list)
    });
  }

  getmessageTimeArray(index: number) {
    this.messageTimeArray = [];
    this.privateChannelArray[index].messageTime.forEach((list: any) => {
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
      })
      this.getSelectedPrivateChannelId();
    })
  }

  privateChannelRef() {
    return collection(this.firestore, 'private-channels')
  }

  ngOnDestroy() {
    this.unsubprivateChannel;
  }
}
