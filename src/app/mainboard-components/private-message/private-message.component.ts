import { Component, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent implements OnChanges {

  privateChannelArray: any[] = [];
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

  getPrivateChannelId(){
    if(this.mainboard.loggedInUserName == this.privateChannelArray[0]['member1'] || this.privateChannelArray[0]['member2'] && this.mainboard.selectedUserDirectMessageName == this.privateChannelArray[0]['member1'] || this.privateChannelArray[0]['member2'])
    console.log(this.privateChannelArray[0]['privateChannelId']);
    
  }




  //----Subscribe-Functions----//

  subprivateChannel(){
    return onSnapshot(this.privateChannelRef(), (list) => {
      this.privateChannelArray = [];
      list.forEach(element => {
        this.privateChannelArray.push({
          member1: element.data()['member1'],
          member2: element.data()['member2'],
          privateChannelId: element.id,
        })
      })
      this.getPrivateChannelId();
    })
  }
  privateChannelRef(){
    return collection(this.firestore, 'private-channels')
  }
}
