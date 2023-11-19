import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-add-members-mainboard-headline',
  templateUrl: './add-members-mainboard-headline.component.html',
  styleUrls: ['./add-members-mainboard-headline.component.scss']
})
export class AddMembersMainboardHeadlineComponent {

  constructor(private mainboard: MainboardComponent){
  }

  closeAddNewMembersWindow(event: Event){
    event.stopPropagation();
    this.mainboard.toggleAddNewMembers = false;
    this.mainboard.toggleBackground = false;
    }
}
