import { Component } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent {

  constructor(private mainboard: MainboardComponent, private router: Router) { }

  hideProfile(event: Event) {
    event.stopPropagation();
    this.mainboard.toggleProfile = false;
    this.mainboard.toggleBackground = false;
  }

  showProfileViewPopUp() {
    this.mainboard.toggleProfileView = true;
  }

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

}
