import { Component, Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';


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
  loggedInUserImg!: string;
 
  firestore: Firestore = inject(Firestore)
  channelName: string = '';
  channelDescription: string = '';
  channelsArray: Array<any> = [];
  
  username: string = '';
  id: string = '';
  img: string = '';
  userArray: Array<any> = [];

  unsubChannels;
  unsubUsers;

  constructor(private route: ActivatedRoute, private mainboard: MainboardComponent) {
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

  selectChannel(id: number){
    let selectedChannelTitle = this.channelsArray[id].channelName;
    let selectedChannelDescription = this.channelsArray[id].channelDescription;
    this.mainboard.selectedChannelTitle = selectedChannelTitle;
    this.mainboard.selectedChannelDescription = selectedChannelDescription;
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
          this.loggedInUserImg = this.img;
      
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
        this.channelsArray.push({ channelName: element.data()['name'], channelDescription: element.data()['description'] });
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
