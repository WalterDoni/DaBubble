import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-add-members-mainboard-headline',
  templateUrl: './add-members-mainboard-headline.component.html',
  styleUrls: ['./add-members-mainboard-headline.component.scss']
})
export class AddMembersMainboardHeadlineComponent {

  constructor(public mainboard: MainboardComponent) {
  }

  closeAddNewMembersWindow(event: Event) {
    event.stopPropagation();
    this.mainboard.toggleAddNewMembers = false;
    this.mainboard.toggleBackground = false;
  }

  addMemberToChannel() {
    let searchTermWithFirstLetterBig = this.mainboard.searchTermChannelMember.charAt(0).toUpperCase() + this.mainboard.searchTermChannelMember.slice(1);
    this.mainboard.channelsArray.forEach(channel => {
      channel.members.forEach((member: any) => {
        if (member == searchTermWithFirstLetterBig) {
          alert("Dieser Nutzer befindet sich bereits im Channel!");
          return;
        } else {
       //--TODO-- Member hinzufügen//
        }
      });
    });
  }
}
