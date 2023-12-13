import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {

  firestore: Firestore = inject(Firestore);
  channelsArray: any[] = [];
  unsubChannels;

  selectedChannelTitle!: string;
  selectedChannelDescription!: string;

  changeChannelName: boolean = false;
  changeChannelDescription: boolean = false;

  @ViewChild('newChannelName') newChannelName!: ElementRef;
  @ViewChild('newChannelDescription') newChannelDescription!: ElementRef;
  channelID!: string;

  constructor(public mainboard: MainboardComponent) {
    this.unsubChannels = this.subChannels();
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
    this.selectedChannelDescription = this.mainboard.selectedChannelDescription;
  }

  hideEditChannel(event: Event) {
    event.stopPropagation();
    this.mainboard.toggleEditChannel = false;
    this.mainboard.toggleBackground = false;
  }

  toggleChangeChannelName() {
    this.changeChannelName = !this.changeChannelName;
  }

  toggleChangeChannelDescription() {
    this.changeChannelDescription = !this.changeChannelDescription;
  }

  getCorrectChannelID() {
    this.channelsArray.forEach(channel => {
      if (channel.name == this.selectedChannelTitle) {
        this.channelID = channel.channelId;
        console.log(this.channelID);
      }
    });
  }

  async choosenNewChannelName() {
    let newName = this.newChannelName.nativeElement.value;
    await updateDoc(doc(this.channelsRef(), this.channelID), { name: newName });
    this.selectedChannelTitle = newName;
    this.mainboard.selectedChannelTitle = newName; 
  }

  async choosenNewChannelDesription() {
    let newDescription = this.newChannelDescription.nativeElement.value;
    await updateDoc(doc(this.channelsRef(), this.channelID), { description: newDescription });
    this.selectedChannelDescription = newDescription;
    this.mainboard.selectedChannelDescription = newDescription; 
  }


  //----Subscribe-Functions----//
  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      this.channelsArray = [];
      list.forEach(element => {
        this.channelsArray.push({
          name: element.data()['name'],
          description: element.data()['description'],
          channelId: element.id,
        });
      });
      console.log(this.channelsArray);

    });
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngonDestroy() {
    this.unsubChannels();
  }

}
