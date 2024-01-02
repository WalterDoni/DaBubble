import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, collection, onSnapshot } from '@angular/fire/firestore';
import { User } from '../models/user';
import { Storage, ref, getDownloadURL, uploadBytesResumable } from "@angular/fire/storage";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  selectedUsername: string = 'Kein Benutzername angegeben.';
  selectedImg: string = 'profile.png';
  selectedUrl: string | null = null;
  customizedImg: boolean = false;
  avatars: Array<string> = ['avatar0.png', 'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png'];

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    defaultImg: new FormControl('', Validators.required),
    personalImg: new FormControl('', Validators.required),
  })

  @ViewChild('firstPartNewAccount') firstPartNewAccount!: ElementRef;
  @ViewChild('secondPartNewAccount') secondPartNewAccount!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  firestore: Firestore = inject(Firestore);
  newUser = new User();
  uploadedImg: any = {};

  constructor(private router: Router, private authService: AuthService, public storage: Storage, private cdr: ChangeDetectorRef) {
  }

  //----SignUp-Function----//
  async signUp() {
    let userData: any;
    if (this.selectedUrl && this.selectedUrl.length !== null) {
      userData = Object.assign(this.registerForm.value,
        {
          email: this.emailInput.nativeElement.value,
          password: this.passwordInput.nativeElement.value,
          username: this.usernameInput.nativeElement.value,
          personalImg: this.selectedUrl,
        });
    } else {
      userData = Object.assign(this.registerForm.value,
        {
          email: this.emailInput.nativeElement.value,
          password: this.passwordInput.nativeElement.value,
          username: this.usernameInput.nativeElement.value,
          defaultImg: './assets/img/signup/' + this.selectedImg,
        });
    }
    this.authService.registerWithEmailAndPassword(userData).then(async (res: any) => {
      let user = new User(userData)
      this.newUser = user.toJSON();
      await addDoc(this.usersRef(), this.newUser).catch((error) => {
        console.log(error);
      }).then(() => { })
    }).catch((error: any) => {
      console.log(error);
    })
    this.goToLoginPage()
  }

  //----Img Upload----//
  uploadImg(event: any) {
    this.uploadedImg = event.target.files[0];
    this.saveInStorage();
  }

  saveInStorage() {
    let storageRef = ref(this.storage, this.uploadedImg.name);
    let uploadTask = uploadBytesResumable(storageRef, this.uploadedImg)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          if (downloadURL) {
            this.customizedImg = true;
            this.selectedUrl = downloadURL;
            this.cdr.detectChanges();
          }
        });
      }
    );
  }

  //----Help-Functions----//
  changeImgSignUp(index: number) {
    this.customizedImg = false;
    this.selectedImg = 'avatar' + index + '.png'
  }

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

  showFirstPart() {
    this.selectedImg = 'profile.png';
    this.secondPartNewAccount.nativeElement.classList.add('d-none');
    this.firstPartNewAccount.nativeElement.classList.remove('d-none');
  }

  showSecondPart() {
    let { inputName, emailInput, passwordInput } = this.checkValidity();
    if (inputName && emailInput && passwordInput) {
      this.firstPartNewAccount.nativeElement.classList.add('d-none');
      this.secondPartNewAccount.nativeElement.classList.remove('d-none');
    }
  }

  checkValidity() {
    let inputName = false;
    let emailInput = false;
    let passwordInput = false;
    if (this.usernameInput.nativeElement.value.length >= 1) {
      this.selectedUsername = this.usernameInput.nativeElement.value;
      inputName = true;
    } else {
      alert("Bitte einen Namen einfügen!");
    }
    if (this.emailInput.nativeElement.value.length >= 1) {
      emailInput = true;
    } else {
      alert("Bitte eine Email-Adresse eingeben!");
    }
    if (this.passwordInput.nativeElement.value.length >= 4) {
      passwordInput = true;
    } else {
      alert("Mindestens 4 Zeichen bei dem Passwort verwenden");
    }
    return { inputName, emailInput, passwordInput };
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  showDataProtection() {
    this.router.navigateByUrl('dataProtection');
  }

}