import { Component, ElementRef, Injectable, ViewChild, inject } from '@angular/core';
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
  channelID: string = '';
  channelsArray: Array<any> = [];

  username: string = '';
  id: string = '';
  img: string = '';
  userArray: Array<any> = [];

  unsubChannels;
  unsubUsers;

  @ViewChild('arrowChannels') arrowChannels!: ElementRef;
  @ViewChild('listChannels') listChannels!: ElementRef;
  @ViewChild('arrowDirectmessage') arrowDirectmessage!: ElementRef;
  @ViewChild('listDirectmessage') listDirectmessage!: ElementRef;
  openTableChannels: boolean = true;
  openTableDirectMessages: boolean = true;

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

  selectChannel(id: number) {
    this.mainboard.chatContent = true;
    this.mainboard.directMessageContent = false;
    this.mainboard.menuSearchfieldChat = false;
    this.mainboard.selectedChannelTitle = this.channelsArray[id].channelName;
    this.mainboard.selectedChannelDescription = this.channelsArray[id].channelDescription;
    this.mainboard.channelID = this.channelsArray[id].channelID;
    this.mainboard.channelContent();
  }

  selectUserForDirectmessage(id: number) {
    this.mainboard.directMessageContent = true;
    this.mainboard.menuSearchfieldChat = false;
    this.mainboard.chatContent = false;
    this.mainboard.selectedUserDirectMessageImage = this.userArray[id].img;
    this.mainboard.selectedUserDirectMessageName = this.userArray[id].username;
  }

  openMenuSearchFieldOnChat() {
    this.mainboard.menuSearchfieldChat = true;
    this.mainboard.directMessageContent = false;
    this.mainboard.chatContent = false;

  }

  //----Folding-Functions---//

  toggletableChannels() {
    this.openTableChannels = !this.openTableChannels
    if (this.openTableChannels) {
      this.arrowChannels.nativeElement.classList.remove('rotate-270');
      this.listChannels.nativeElement.style.display = 'flex';
    } else {
      this.arrowChannels.nativeElement.classList.add('rotate-270');
      this.listChannels.nativeElement.style.display = 'none';
    }
  }

  toggletableDirectmessages() {
    this.openTableDirectMessages = !this.openTableDirectMessages
    if (this.openTableDirectMessages) {
      this.arrowDirectmessage.nativeElement.classList.remove('rotate-270');
      this.listDirectmessage.nativeElement.style.display = 'flex';
    } else {
      this.arrowDirectmessage.nativeElement.classList.add('rotate-270');
      this.listDirectmessage.nativeElement.style.display = 'none';
    }
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
        this.channelsArray.push({ channelName: element.data()['name'], channelDescription: element.data()['description'], channelID: element.id });
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
