import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  @ViewChild('email') email!: ElementRef;

  showEmailHasBeenSend: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  sendResetMail(){
    let mail = this.email.nativeElement.value;
    this.authService.forgotPassword(mail);
    this.showEmailHasBeenSend = true;
    setTimeout(() => {
      this.showEmailHasBeenSend = false;
      this.router.navigateByUrl('');
    }, 2000);
  }

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

}
