import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-profil-view',
  templateUrl: './profil-view.component.html',
  styleUrls: ['./profil-view.component.scss']
})
export class ProfilViewComponent {
  loggedInUserName!: string;
  loggedInUserEmail!: string;
  loggedInUserImg!: string;
  changeName: boolean = false;

  constructor(public mainboard: MainboardComponent) {
    this.loggedInUserName = this.mainboard.loggedInUserName;
    this.loggedInUserEmail = this.mainboard.loggedInUserEmail;
    this.loggedInUserImg = this.mainboard.loggedInUserImg;
   }

toggleChangeName(){
  this.changeName = !this.changeName;
}

}
