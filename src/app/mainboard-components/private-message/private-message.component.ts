import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, updateDoc, doc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { timestamp } from 'rxjs';
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

  constructor(public mainboard: MainboardComponent, private cdr: ChangeDetectorRef) {
    this.unsubprivateChannel = this.subprivateChannel();
  }

  //----Add-New-Message and new channel----//
  async newCommentInSelectedPrivateChannel() {
    let input = this.newCommentValue.nativeElement.value;
    this.mainboard.messageTextArray.push(input);
    this.mainboard.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.mainboard.messageTimeArray.push(timestamp);
    for (const channel of this.privateChannelArray) {
      if (channel.privateMessageFromUser == this.mainboard.loggedInUserName && channel.privateMessageToUser == this.mainboard.selectedUserDirectMessageName) {
        this.channelId = channel.privateChannelId;
        await updateDoc(doc(this.privateChannelRef(), this.channelId), {
          messageFrom: this.mainboard.messageFromArray,
          messageText: this.mainboard.messageTextArray,
          messageTime: this.mainboard.messageTimeArray,
        });
      }
    }
    if (this.checkIfChannelExist()) {
      await this.createNewPrivateChannel(input);
    }
    this.newCommentValue.nativeElement.value = '';
  }

  checkIfChannelExist() {
    if (this.channelId) {
      return false;
    }
    else {
      this.channelId == undefined;
      let counter = 0;
      let nameArray: any[] = []
      let userArray: any[] = []
      this.privateChannelArray.forEach((member, i) => {
        nameArray.push(member.privateMessageToUser)
        if (member.privateMessageFromUser !== userArray[i - 1]) {
          userArray.push(member.privateMessageFromUser)
        }
      });
      nameArray.forEach(name => {
        if (name == this.mainboard.selectedUserDirectMessageName) {
          counter + 1
        }
      });
      if (!userArray.includes(this.mainboard.loggedInUserName)) {
        counter = 0;
      }
      if (counter === 0) {
        return true
      } else {
        return false;
      }
    }
  }

  async createNewPrivateChannel(input: string) {
    await this.clearArrays();
    this.mainboard.messageTextArray.push(input);
    this.mainboard.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.mainboard.messageTimeArray.push(timestamp);
    debugger
    await addDoc(this.privateChannelRef(), {
      privateMessageFromUser: this.mainboard.loggedInUserName,
      privateMessageToUser: this.mainboard.selectedUserDirectMessageName,
      messageFrom: this.mainboard.messageFromArray,
      messageText: this.mainboard.messageTextArray,
      messageTime: this.mainboard.messageTimeArray,
    })

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

  //----Create-Arrays----//
  getMessageFromArray(index: number) {
    this.messageFromArray = [];
    this.privateChannelArray[index].messageFrom.forEach((list: any) => {
      this.messageFromArray.push(list)
    });
    this.mainboard.messageFromArray = this.messageFromArray
  }

  getmessageTextArrayArray(index: number) {
    this.messageTextArray = [];
    this.privateChannelArray[index].messageText.forEach((list: any) => {
      this.messageTextArray.push(list)
    });
    this.mainboard.messageTextArray = this.messageTextArray
  }

  getmessageTimeArray(index: number) {
    this.messageTimeArray = [];
    this.privateChannelArray[index].messageTime.forEach((list: any) => {
      this.messageTimeArray.push(list)
    });
    this.mainboard.messageTimeArray = this.messageTimeArray
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
    })
  }

  privateChannelRef() {
    return collection(this.firestore, 'private-channels')
  }

  ngOnDestroy() {
    this.unsubprivateChannel;
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
