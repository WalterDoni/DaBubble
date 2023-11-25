import { Component, Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from 'src/app/login/login.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class MenuComponent {
  toggleCreateChannel: boolean = false;

  userId: string = '';
  loggedInUserName!: string;
 
  firestore: Firestore = inject(Firestore)
  channelsArray: Array<string> = [];
  
  username: string = '';
  id: string = '';
  img: string = '';
  userArray: Array<any> = [];

  unsubChannels;
  unsubUsers;

  constructor(private route: ActivatedRoute, public loginComp: LoginComponent) {
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let idParam = params.get('ref')
      this.userId = idParam !== null ? idParam : '';
    });
  }

  openCreateChannelPopUp() {
    this.toggleCreateChannel = true;
  }

  //----Subscribe-Functions----//
  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        let defaultImg = element.data()['defaultImg'];
        let personalImg = element.data()['personalImg'];
        if (defaultImg && defaultImg.length >= 1) {
          this.img = defaultImg;
        } else {
          this.img = personalImg;
        }
        if (element.id == this.userId) {
          this.loggedInUserName = element.data()['username'];
      
        } else {
          this.userArray.push({ username: element.data()['username'], id: element.id, img: this.img });
        }
      })
    })
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      this.channelsArray = [];
      list.forEach(element => {
        let array = element.data();
        this.channelsArray.push(array['name']);
      });
    });
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngonDestroy() {
    this.unsubUsers();
    this.unsubChannels();
  }

}
