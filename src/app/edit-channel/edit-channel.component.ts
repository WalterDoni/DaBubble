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
  selectedChannelCreated!: string;

  changeChannelName: boolean = false;
  changeChannelDescription: boolean = false;

  @ViewChild('newChannelName') newChannelName!: ElementRef;
  @ViewChild('newChannelDescription') newChannelDescription!: ElementRef;
  channelID!: string;

  errormessage: boolean = false;

  constructor(public mainboard: MainboardComponent) {
    this.unsubChannels = this.subChannels();
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
    this.selectedChannelDescription = this.mainboard.selectedChannelDescription;
    this.selectedChannelCreated = this.mainboard.selectedChannelCreated;
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
      }
    });
  }

  async choosenNewChannelName() {
    if (this.newChannelName.nativeElement.value.length >= 1) {
      let newName = this.newChannelName.nativeElement.value;
      await updateDoc(doc(this.channelsRef(), this.channelID), { name: newName });
      this.selectedChannelTitle = newName;
      this.mainboard.selectedChannelTitle = newName;
      this.errormessage = false;
      this.toggleChangeChannelName()
    } else {
      this.errormessage = true;
    }
  }

  async choosenNewChannelDesription() {
    let newDescription = this.newChannelDescription.nativeElement.value;
    await updateDoc(doc(this.channelsRef(), this.channelID), { description: newDescription });
    this.selectedChannelDescription = newDescription;
    this.mainboard.selectedChannelDescription = newDescription;
  }

  async leaveChannel() {
    this.channelsArray.forEach(channel => {
      if (channel.channelId == this.mainboard.channelID) {
        channel.members.forEach(async (member: any, index: number) => {
          if (member == this.mainboard.loggedInUserName) {
            channel.members.splice(index, 1);
            await updateDoc(doc(this.channelsRef(), this.mainboard.channelID), { members: channel.members })
          }
        });
      }
    });
  }

  //----Subscribe-Functions----//
  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      this.channelsArray = [];
      list.forEach(element => {
        this.channelsArray.push({
          name: element.data()['name'],
          description: element.data()['description'],
          members: element.data()['members'],
          channelId: element.id,
        });
      });
    });
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngonDestroy() {
    this.unsubChannels();
  }

}
