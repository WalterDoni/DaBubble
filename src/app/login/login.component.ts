import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('textAnimation', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-350px)' })),
      transition('hidden => visible', [
        animate('1.3s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('slideAnimation', [
      state('middle', style({ transform: 'translateX(200px)' })),
      state('left', style({ transform: 'translateX(0)' })),
      transition('middle => left', animate('0.5s ease-in')),
    ]),
    trigger('backgroundAnimation', [
      state('initial', style({ opacity: 1 })),
      state('mid', style({ opacity: 0.5 })),
      state('final', style({ opacity: 0 })),
      transition('initial => mid', animate('0.5s ease-in')),
      transition('mid => final', animate('0.2s ease-in')),
    ]),
    trigger('moveAnimation', [
      state('middle', style({ transform: 'translate(-50%, -50%)' })), // Initial state (centered)
      state(
        'top-left',
        style({ top: '175px', left: '375px', fontSize: '32px' })
      ), // Target state (top-left corner)
      transition('middle => top-left', animate('0.3s ease-out')), // Transition from middle to top-left
    ]),
  ],
})
export class LoginComponent {
  loggedInUser: string = '';
  email: string = '';
  id: string = '';
  loginArray: Array<any> = [];
  errormessage: boolean = false;

  
  //----Intro----//
  animationPlayed: boolean = false;
  textState: string = 'hidden'; 
  svgTransform: string = 'middle';
  backgroundState: string = 'inital';
  setNone: boolean = false;
  moveState: string = 'middle';
  //----Intro-End----//


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
    if (!this.animationPlayed) {
      this.playAnimation();
    }
  }

  //----Intro----//
  playAnimation() {
    this.textState = 'hidden';
    setTimeout(() => {
      this.svgTransform = 'left';
    }, 500);
    setTimeout(() => {
      this.textState = 'visible';
    }, 1000);
    setTimeout(() => {
      this.moveState = 'top-left';
    }, 2600);
    setTimeout(() => {
      this.backgroundState = 'mid';
    }, 2700);
    setTimeout(() => {
      this.backgroundState = 'final';
      this.setNone = true;
    }, 2900);
    this.animationPlayed = true;
  }
  //----Intro-End----//

  loginWithEmailAndPassword() {
    let userData = Object.assign(this.loginForm.value, { email: this.emailInput.nativeElement.value, password: this.passwordInput.nativeElement.value });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      console.log('Erfolgreich mit Account angemeldet');
      this.loginArray.forEach((user) => {
        if (user.email == this.emailInput.nativeElement.value) {
          this.loggedInUser = user.id;
          this.errormessage = false;
          this.router.navigateByUrl('mainboard/' + user.id);
        }
      })
    }).catch((error: any) => {
      this.errormessage = true;
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
