import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  signInWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider())
  }


  registerWithEmailAndPassword(user: { email: string, password: string }) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  signInWithEmailAndPassword(user: { email: string, password: string }) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }
}
