import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  @ViewChild('firstPartNewAccount') firstPartNewAccount!: ElementRef;
  @ViewChild('secondPartNewAccount') secondPartNewAccount!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  avatars: Array<string> = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png'];

  firestore: Firestore = inject(Firestore);
  unsubUsers;

  constructor(private router: Router, private authService: AuthService) {
    this.unsubUsers = this.subUsers();
  }

  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        console.log(element.data());})
    })
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  ngonDestroy() {
    this.unsubUsers();
  }
  signUp() {
    let userData = Object.assign(this.registerForm.value, { email: this.emailInput.nativeElement.value, password: this.passwordInput.nativeElement.value });
    this.authService.registerWithEmailAndPassword(userData).then((res: any) => {
      console.log('Erfolgreich registriert');
      this.router.navigateByUrl('mainboard');
    }).catch((error: any) => {
      console.log(error);

    })
  }

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

  showFirstPart() {
    this.secondPartNewAccount.nativeElement.classList.add('d-none');
    this.firstPartNewAccount.nativeElement.classList.remove('d-none');
  }
  showSecondPart() {
    this.firstPartNewAccount.nativeElement.classList.add('d-none');
    this.secondPartNewAccount.nativeElement.classList.remove('d-none');
  }
}
