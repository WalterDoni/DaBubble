import { Component } from '@angular/core';
import { MainboardComponent } from '../../mainboard/mainboard.component';

@Component({
  selector: 'app-members-mainboard-headline',
  templateUrl: './members-mainboard-headline.component.html',
  styleUrls: ['./members-mainboard-headline.component.scss']
})
export class MembersMainboardHeadlineComponent {
  loggedInUserName!: string
  loggedInUserImg!: string 
  userArray: any = []

  constructor(public mainboard: MainboardComponent){
    
    this.loggedInUserName = this.mainboard.loggedInUserName;
    this.loggedInUserImg = this.mainboard.loggedInUserImg;
    this.userArray = this.mainboard.userArray;

  }

  handleAddMembersClick(event: Event) {
    this.closeAddMembersPopUp(event);
    this.mainboard.overlayBackroundColor();
    this.mainboard.openAddNewMembersWindow();
  }

  closeAddMembersPopUp(event: Event){
    event.stopPropagation();
    this.mainboard.toggleEditMembers = false;
    this.mainboard.toggleBackground = false;
  }

}
