import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuComponent } from '../mainboard-components/menu/menu.component';
import { MainboardComponent } from '../mainboard/mainboard.component';
import { Firestore, addDoc, collection, onSnapshot } from '@angular/fire/firestore';
import { Channel } from '../models/channel';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {
  @ViewChild('newChannelName') newChannelName!: ElementRef;
  @ViewChild('newChannelDescription') newChannelDescription!: ElementRef;

  errormessage: boolean = false;

  constructor(private menu: MenuComponent, private mainboard: MainboardComponent) {
    this.mainboard.unsubChannels = this.mainboard.subChannels
  }

  async createChannel() {
    if(this.newChannelName.nativeElement.value.length >= 1){
    let values = {
      name: this.newChannelName.nativeElement.value,
      description: this.newChannelDescription.nativeElement.value,
      members: [this.mainboard.loggedInUserName],
      created: this.mainboard.loggedInUserName,
    }
    let newChannel = new Channel(values)
    newChannel = newChannel.toJSON();
    await addDoc(this.mainboard.channelsRef(), newChannel).then(() => {
      this.closeWindow();
      this.errormessage = false;
    })
      .catch((error) => {
        console.log(error)
      })
    }else{
      this.errormessage = true;
    }
  }

  closeWindow() {
    this.menu.toggleCreateChannel = false;
  }

  stopClosing(event: Event) {
    event.stopPropagation();
  }
}
