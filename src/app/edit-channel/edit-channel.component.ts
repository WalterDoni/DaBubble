import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {

  selectedChannelTitle!: string;
  selectedChannelDescription!: string;
  selectedChannelCreated!: string;

  changeChannelName: boolean = false;
  changeChannelDescription: boolean = false;

  @ViewChild('newChannelName') newChannelName!: ElementRef;
  @ViewChild('newChannelDescription') newChannelDescription!: ElementRef;
  channelID!: string;

  errormessage: boolean = false;
  sureContainer: boolean = false;

  firestore: Firestore = inject(Firestore);
  channelsArray: any[] = [];
  unsubChannels;

  constructor(public mainboard: MainboardComponent) {
    this.unsubChannels = this.subChannels();
    this.selectedChannelTitle = this.mainboard.selectedChannelTitle;
    this.selectedChannelDescription = this.mainboard.selectedChannelDescription;
    this.selectedChannelCreated = this.mainboard.selectedChannelCreated;
  }

  /**
   * Retrieves the correct channel ID based on the selected channel title.
   * Iterates through the channelsArray to find a match with the selectedChannelTitle.
   * If a match is found, sets the channelID to the corresponding channelId.
   */
  getCorrectChannelID() {
    this.channelsArray.forEach(channel => {
      if (channel.name == this.selectedChannelTitle) {
        this.channelID = channel.channelId;
      }
    });
  }

  /**
 * Asynchronously updates the name of the selected channel with the provided new name.
 *
 * If the length of the new channel name is greater than or equal to 1,
 * updates the channel name in the Firestore document using `updateDoc`.
 * Updates the selectedChannelTitle, mainboard.selectedChannelTitle, and hides error messages.
 * Finally, toggles the change channel name interface.
 *
 * If the length of the new channel name is less than 1, displays an error message.
 *
 */
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

/**
 * Asynchronously updates the description of the selected channel with the provided new description.
 *
 * Retrieves the new description from the newChannelDescription element and
 * updates the channel description in the Firestore document using `updateDoc`.
 * Updates the selectedChannelDescription and mainboard.selectedChannelDescription.
 * 
 */
  async choosenNewChannelDesription() {
    let newDescription = this.newChannelDescription.nativeElement.value;
    await updateDoc(doc(this.channelsRef(), this.channelID), { description: newDescription });
    this.selectedChannelDescription = newDescription;
    this.mainboard.selectedChannelDescription = newDescription;
  }

  /**
 * Asynchronously removes the current user from the members list of the selected channel.
 *
 * Iterates through the channelsArray to find the channel with a matching channelId.
 * Checks if the logged-in user is a member of the channel and removes them from the members list.
 * Updates the Firestore document with the modified members list using `updateDoc`.
 *
 */
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

  //----Help-Functions----//

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

  toogleSureContainer() {
    this.sureContainer = !this.sureContainer;
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

  ngOnDestroy() {
    this.unsubChannels();
  }

}
