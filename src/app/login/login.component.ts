import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { textAnimationTrigger, slideAnimationTrigger, backgroundAnimationTrigger, moveAnimationTrigger } from '../services/apply.animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [textAnimationTrigger,
    slideAnimationTrigger,
    backgroundAnimationTrigger,
    moveAnimationTrigger],
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

  /**
 * Plays the animation by changing the states and transforming elements.
 * transformations at specific time intervals using setTimeout.
 * 
 */
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

  /**
 * This method extracts user data from the login form, signs in using email and password,
 * and navigates to the mainboard upon successful login.
 * @throws {Error} If there is an error during the login process.
 */
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

  /**
 * This method logs in a guest user with predefined credentials and navigates to the mainboard.
 * @throws {Error} If there is an error during the guest login process.
 */
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

  /**
   * This method initiates the Google authentication process and navigates to the mainboard upon successful login.
   * @throws {Error} If there is an error during the Google login process.
   */
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
