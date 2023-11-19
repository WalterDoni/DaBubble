import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {

  constructor(private router: Router) {

  }


  goToLoginPage() {
    this.router.navigateByUrl('');
  }

}
