import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loggedInUser: string = '';
  email: string = '';
  id: string = '';
  loginArray: Array<any> = [];

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  firestore: Firestore = inject(Firestore)
  unsubUsers;

  constructor(private router: Router, private authService: AuthService) {
    this.unsubUsers = this.subUsers();
  }

  loginWithEmailAndPassword() {
    let userData = Object.assign(this.loginForm.value, { email: this.emailInput.nativeElement.value, password: this.passwordInput.nativeElement.value });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      console.log('Erfolgreich mit Account angemeldet');
      this.loginArray.forEach((user) => {
        if (user.email == this.emailInput.nativeElement.value) {
          this.loggedInUser = user.id;
          this.router.navigateByUrl('mainboard/' + user.id);
        }
      })
    }).catch((error: any) => {
      alert('Fehler, kein Account gefunden.')
    })
  }

  guestLogin() {
    let ref = 'MA8WjoG3lxOo7G6FZO9L'
    let userData = Object.assign(this.loginForm.value, { email: "gast@gast.at", password: "Gast1234" });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      this.loggedInUser = ref;
      this.router.navigateByUrl('mainboard/' + ref);
    }).catch((error: any) => {
      console.log(error);
      alert('Kein Account gefunden')
    })
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then((res: any) => {
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

  //---Subscribe-Functions---// 
  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        this.loginArray.push({ email: element.data()['email'], id: element.id });
        console.log(this.loginArray);
        
      })
    })
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  ngOnDestroy() {
    this.unsubUsers;
  }

}
