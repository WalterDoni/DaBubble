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

  displayMessages: boolean = false;

  privateChannelArray: any[] = [];
  messageFromArray: any[] = [];
  messageTextArray: any[] = [];
  messageTimeArray: any[] = [];
  firestore: Firestore = inject(Firestore);
  unsubprivateChannel;

  constructor(public mainboard: MainboardComponent) {
     this.unsubprivateChannel = this.subprivateChannel();
  }

  //----Add-New-Message and new channel----//
  async newCommentInSelectedPrivateChannel() {
    let input = this.newCommentValue.nativeElement.value;
    this.mainboard.messageTextArray.push(input);
    this.mainboard.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.mainboard.messageTimeArray.push(timestamp);
    let newChannel = true;
    for (const channel of this.privateChannelArray) {
      if (channel.messageBetween.includes(this.mainboard.loggedInUserName) && channel.messageBetween.includes(this.mainboard.selectedUserDirectMessageName)) {
        this.channelId = channel.privateChannelId;
        await updateDoc(doc(this.privateChannelRef(), this.channelId), {
          messageFrom: this.mainboard.messageFromArray,
          messageText: this.mainboard.messageTextArray,
          messageTime: this.mainboard.messageTimeArray,
        });
        newChannel = false;
      }
    }
    if (newChannel) {
      await this.createNewPrivateChannel(input);
    }
    this.newCommentValue.nativeElement.value = '';
  }

  async createNewPrivateChannel(input: string) {
    await this.clearArrays();
    let memberArray: any[] = [];
    memberArray.push(this.mainboard.loggedInUserName);
    memberArray.push(this.mainboard.selectedUserDirectMessageName);
    this.mainboard.messageTextArray.push(input);
    this.mainboard.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.mainboard.messageTimeArray.push(timestamp);
    await addDoc(this.privateChannelRef(), {
      messageBetween: memberArray,
      messageFrom: this.mainboard.messageFromArray,
      messageText: this.mainboard.messageTextArray,
      messageTime: this.mainboard.messageTimeArray,
    })

  }

  //----Get the current ID----//
  getSelectedPrivateChannelId(name: string) {
    for (let i = 0; i < this.privateChannelArray.length; i++) {
      const channel = this.privateChannelArray[i];
      if (channel.messageBetween.includes(this.mainboard.loggedInUserName) && channel.messageBetween.includes(name)) {
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

  //----Create-Arrays----//
  async getMessageFromArray(index: number) {
    this.messageFromArray = [];
    await this.privateChannelArray[index].messageFrom.forEach((list: any) => {
      this.messageFromArray.push(list)
    });
    this.mainboard.messageFromArray = this.messageFromArray;
  }

  async getmessageTextArrayArray(index: number) {
    this.messageTextArray = [];
    await this.privateChannelArray[index].messageText.forEach((list: any) => {
      this.messageTextArray.push(list)
    });
    this.mainboard.messageTextArray = this.messageTextArray;
  }

  async getmessageTimeArray(index: number) {
    this.messageTimeArray = [];
    await this.privateChannelArray[index].messageTime.forEach((list: any) => {
      this.messageTimeArray.push(list)
    });
    this.mainboard.messageTimeArray = this.messageTimeArray;
  }

  //----Subscribe-Functions----//

  subprivateChannel() {
    return onSnapshot(this.privateChannelRef(), (list) => {
      this.privateChannelArray = [];
      list.forEach(element => {
        this.privateChannelArray.push({
          messageBetween: element.data()['messageBetween'],
          messageFrom: element.data()['messageFrom'],
          messageText: element.data()['messageText'],
          messageTime: element.data()['messageTime'],
          privateChannelId: element.id,
        })
      });
    })
  }

  privateChannelRef() {
    return collection(this.firestore, 'private-channels')
  }

  ngOnDestroy() {
    this.unsubprivateChannel();
  }

  //----Helpfunction----//

  clearArrays() {
    this.messageFromArray = [];
    this.messageTextArray = [];
    this.messageTimeArray = [];
    this.mainboard.messageFromArray = this.messageFromArray;
    this.mainboard.messageTextArray = this.messageTextArray;
    this.mainboard.messageTimeArray = this.messageTimeArray;
  }

}
