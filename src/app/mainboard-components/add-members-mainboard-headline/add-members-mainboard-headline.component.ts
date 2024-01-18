import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-add-members-mainboard-headline',
  templateUrl: './add-members-mainboard-headline.component.html',
  styleUrls: ['./add-members-mainboard-headline.component.scss']
})
export class AddMembersMainboardHeadlineComponent {
  @ViewChild('input') input!: ElementRef;

  sureContainer: boolean = false;

  unsubChannelContent;
  firestore: Firestore = inject(Firestore);

  constructor(public mainboard: MainboardComponent) {
    this.unsubChannelContent = this.mainboard.channelContent()
  }

    
  /**
 * Adds members to a channel based on the provided search term.
 * Filters user array for members based on the search term, updating the filtered members array.
 */
  addMemberToChannelSearch() {
    if (this.mainboard.searchTermChannelMember && this.mainboard.searchTermChannelMember.length >= 1) {
      this.mainboard.filteredMemberArray = this.mainboard.userArray.filter(user =>
        user.username.toLowerCase().includes(this.mainboard.searchTermChannelMember.toLowerCase())
      )
    } else {
      this.mainboard.filteredMemberArray = [];
    }
  }

  /**
 * Adds a member to the currently selected channel.
 * Checks if the member already exists in the channel before adding.
 */
  async addMemberToChannel() {
    debugger
    let counter = 0;
    let state = { doNotAddMember: false };
    if (!this.checkIfThereIsAValueInInput()) { return };
    let searchTermWithFirstLetterBig = this.mainboard.searchTermChannelMember.charAt(0).toUpperCase() + this.mainboard.searchTermChannelMember.slice(1);
    this.mainboard.channelsArray.forEach(channel => {
      if (channel.channelId != this.mainboard.channelID) { return };
      this.checkIfMemberIsAllreadyInChannel(channel, searchTermWithFirstLetterBig, state);
      this.checkIfMemberExist(counter, state, searchTermWithFirstLetterBig);
      if (state.doNotAddMember) { return };
      channel.members.push(searchTermWithFirstLetterBig);
      updateDoc(doc(this.mainboard.channelsRef(), this.mainboard.channelID), {
        members: channel.members
      });
    });
  }

  checkIfThereIsAValueInInput() {
    if (this.mainboard.searchTermChannelMember == "" || this.mainboard.searchTermChannelMember == undefined) {
      alert("Bitte Nutzer auswählen!");
      return false;
    } return true;
  }

  checkIfMemberIsAllreadyInChannel(channel: any, searchTermWithFirstLetterBig: string, state: { doNotAddMember: boolean }) {
    channel.members.forEach((member: any) => {
      if (member == searchTermWithFirstLetterBig) {
        alert("Dieser Nutzer befindet sich bereits im Channel!");
        state.doNotAddMember = true;
      }
    });
    return state.doNotAddMember;
  }

  checkIfMemberExist(counter: number, state: { doNotAddMember: boolean }, searchTermWithFirstLetterBig: string) {
    this.mainboard.userArray.forEach((user) => {
      if (user['username'] === searchTermWithFirstLetterBig) {
        counter = counter + 1;
      }
    });
    if (counter == 0) {
      alert("Dieser Nutzer existiert nicht!");
      state.doNotAddMember = true;
    }
    return state.doNotAddMember;
  }

  ngOnDestroy() {
    this.unsubChannelContent();
  }

  toogleSureContainer() {
    this.sureContainer = !this.sureContainer;
  }

  closeAddNewMembersWindow(event: Event) {
    event.stopPropagation();
    this.mainboard.toggleAddNewMembers = false;
    this.mainboard.toggleBackground = false;
  }

  selectMember(name: string) {
    this.input.nativeElement.value = name;
    this.mainboard.searchTermChannelMember = name;
  }
}
