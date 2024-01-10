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

  closeAddNewMembersWindow(event: Event) {
    event.stopPropagation();
    this.mainboard.toggleAddNewMembers = false;
    this.mainboard.toggleBackground = false;
  }

  selectMember(name: string) {
    this.input.nativeElement.value = name;
    this.mainboard.searchTermChannelMember = name;
  }

  async addMemberToChannel() {
    if (this.mainboard.searchTermChannelMember == undefined) {
      alert("Bitte Nutzer auswählen!");
    }
    let searchTermWithFirstLetterBig = this.mainboard.searchTermChannelMember.charAt(0).toUpperCase() + this.mainboard.searchTermChannelMember.slice(1);
    this.mainboard.channelsArray.forEach(channel => {
      if (channel.channelId == this.mainboard.channelID) {
        let memberAlreadyExists = false;
        channel.members.forEach((member: any) => {
          if (member == searchTermWithFirstLetterBig) {
            alert("Dieser Nutzer befindet sich bereits im Channel!");
            memberAlreadyExists = true;
          }
          if (!this.mainboard.userArray.includes(searchTermWithFirstLetterBig)) {
            alert("Dieser Nutzer existiert nicht!");
            memberAlreadyExists = true;
          }
        });
        if (!memberAlreadyExists) {
          channel.members.push(searchTermWithFirstLetterBig);
          updateDoc(doc(this.mainboard.channelsRef(), this.mainboard.channelID), {
            members: channel.members
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.unsubChannelContent();
  }

  toogleSureContainer() {
    this.sureContainer = !this.sureContainer;
  }

}
