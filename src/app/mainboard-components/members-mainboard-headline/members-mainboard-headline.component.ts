import { Component } from '@angular/core';
import { MainboardComponent } from '../../mainboard/mainboard.component';

@Component({
  selector: 'app-members-mainboard-headline',
  templateUrl: './members-mainboard-headline.component.html',
  styleUrls: ['./members-mainboard-headline.component.scss']
})
export class MembersMainboardHeadlineComponent {

  constructor(private mainboard: MainboardComponent){
  }

  closeAddMembersPopUp(event: Event){
    event.stopPropagation();
    this.mainboard.toggleEditMembers = false;
    this.mainboard.toggleBackground = false;
  }

}
