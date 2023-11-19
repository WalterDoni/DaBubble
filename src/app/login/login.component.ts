import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(private router: Router, private authService: AuthService) { }



  loginWithEmailAndPassword() {
    let userData = Object.assign(this.loginForm.value, { email: this.emailInput.nativeElement.value, password: this.passwordInput.nativeElement.value });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      console.log('Erfolgreich mit Account angemeldet');
      this.router.navigateByUrl('mainboard');
    }).catch((error: any) => {
      alert('Fehler, kein Account gefunden.')
    })

  }


  guestLogin() {
    let userData = Object.assign(this.loginForm.value, { email: "gast@gast.at", password: "Gast1234" });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      this.router.navigateByUrl('mainboard');
      console.log('Erfolgreich als Gast angemeldet');

    }).catch((error: any) => {
      console.log(error);
      alert('Kein Account gefunden')
    })
  }


  loginWithGoogle() {
    this.authService.signInWithGoogle().then((res: any) => {
      console.log('Erfolgreich mit Google eingeloggt');
      this.router.navigateByUrl('mainboard');
      
    }).catch((error: any) => {
      console.error(error);
    })
  }
  //---Navigate-Functions---//

  forgotPassword() {
    this.router.navigateByUrl('passwordReset');
  }

  createAccount() {
    this.router.navigateByUrl('signUp');
  }

  showImprint() {
    this.router.navigateByUrl('imprint');
  }

  showDataProtection() {
    this.router.navigateByUrl('dataProtection');
  }

}
