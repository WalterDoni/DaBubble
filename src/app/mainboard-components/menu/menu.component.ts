import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { CreateChannelComponent } from 'src/app/create-channel/create-channel.component';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  firestore: Firestore = inject(Firestore)
  channelsArray: Array<string> = [];
  toggleCreateChannel: boolean = false;
  unsubChannels;

  constructor(){
    this.unsubChannels = this.subChannels();
  }


  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      this.channelsArray = [];
      list.forEach(element => {
        let array = element.data();
        this.channelsArray.push(array['name']);
      });
    });
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngonDestroy() {
    this.unsubChannels();
  }


  openCreateChannelPopUp(){
     this.toggleCreateChannel = true;
  }



}
