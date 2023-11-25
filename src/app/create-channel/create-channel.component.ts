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

  constructor(private menu: MenuComponent, private mainboard: MainboardComponent) {
    this.mainboard.unsubChannels = this.mainboard.subChannels
  }

  async createChannel() {
    let values = {
      name: this.newChannelName.nativeElement.value,
      desciption: this.newChannelDescription.nativeElement.value,
    }
    let newChannel = new Channel(values)
    newChannel = newChannel.toJSON();
    await addDoc(this.mainboard.channelsRef(), newChannel).then(() => {
      this.closeWindow();
    })
      .catch((error) => {
        console.log(error)
      })
  }

  closeWindow() {
    this.menu.toggleCreateChannel = false;
  }

  stopClosing(event: Event) {
    event.stopPropagation();
  }
}
