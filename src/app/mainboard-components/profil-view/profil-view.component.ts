import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-profil-view',
  templateUrl: './profil-view.component.html',
  styleUrls: ['./profil-view.component.scss']
})
export class ProfilViewComponent {

  firestore: Firestore = inject(Firestore);
  usersArray: any[] = [];
  unsubUsers;

  loggedInUserName!: string;
  loggedInUserEmail!: string;
  loggedInUserImg!: string;

  changeName: boolean = false;
  userId: string = '';
  @ViewChild('inputValue') inputValue!: ElementRef;

  errormessage: boolean = false;

  constructor(public mainboard: MainboardComponent) {
    this.unsubUsers = this.subUsers()
    this.loggedInUserName = this.mainboard.loggedInUserName;
    this.loggedInUserEmail = this.mainboard.loggedInUserEmail;
    this.loggedInUserImg = this.mainboard.loggedInUserImg;
    this.userId = this.mainboard.userId;
  }

  toggleChangeName() {
    this.changeName = !this.changeName;
  }

  async updateName(){
    if(this.inputValue.nativeElement.value.length >= 1){
    let newName = this.inputValue.nativeElement.value;
    await updateDoc(doc(this.usersRef(), this.userId), {username: newName });
    this.loggedInUserName = newName;
    this.errormessage = false;
    this.toggleChangeName()
    }else{
      this.errormessage = true;
    }
  }

  //---Subscribe-Functions---// 
  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      this.usersArray = [];
      list.forEach(element => {
        this.usersArray.push({ username: element.data()['username'], id: element.id });
        console.log(this.usersArray);
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
