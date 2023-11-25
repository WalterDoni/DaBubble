import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Route } from '@angular/router';


@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss']
})
export class MainboardComponent implements OnInit  {

  userId!: string;

  @ViewChild('thread') thread!: ElementRef;

  toggleMenu: boolean = true;
  toggleThread: boolean = false;
  toggleEditChannel: boolean = false;
  toggleEditMembers: boolean = false;
  toggleAddNewMembers: boolean = false;
  toggleBackground: boolean = false;
  toggleProfile: boolean = false;

  isPopupForThreadVisible: boolean = false;
  isPopupForReactionsVisible: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth1400();
  }

  firestore: Firestore = inject(Firestore);
  channelsArray: Array<string> = [];

  username: string = '';
  id: string = '';
  userArray: Array<any> = [];

  unsubUsers;
  unsubChannels;

  constructor(private route: ActivatedRoute) {
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
  }

  ngOnInit(){
    debugger
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam !== null ? idParam : '';
      console.log(this.userId);
    });
  }

/* getNameOfLoggedInUser(){
this.userArray.forEach(element => {
  if(element.id === this.loginComp.loggedInUser){
    this.loggedInUserName = element.username;
  }
});
} */

  //--Thread-Popup--//
  showPopupForThread(event: MouseEvent) {
    this.isPopupForThreadVisible = true;
  }

  hidePopupForThread() {
    this.isPopupForThreadVisible = false;
  }

  //--Thread-Menu--//
  showThread() {
    this.toggleThread = true;
    if (this.toggleMenu && this.toggleThread && window.innerWidth < 1400) {
      this.toggleMenu = false;
    }
  }

  //--Reactions-Popup--//
  showPopupForReactions(event: MouseEvent) {
    this.isPopupForReactionsVisible = true;
  }

  hidePopupForReactions() {
    this.isPopupForReactionsVisible = false;
  }

  //--Edit-Channel-Window--//
  openCreateChannelPopUp() {
    this.toggleEditChannel = true;
  }


  //--Add-Members-Window--//
  openAddMembersPopUp() {
    this.toggleEditMembers = true;
  }

  openAddNewMembersWindow() {
    this.toggleAddNewMembers = true;
  }

  //--Profile--//
  openProfile() {
    this.toggleProfile = true;
  }


  //---Subscribee-Functions---//
  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        this.userArray.push({ username: element.data()['username'], id: element.id })
      })
    })
  }

  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      list.forEach(element => {
        let array = element.data();
        this.channelsArray.push(array['name']);
      });
    });
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  ngonDestroy() {
    this.unsubUsers();
    this.unsubChannels();
  }

  //--Helpfunctions--//
  toggleMenuVisibility() {
    if (!this.toggleMenu && this.toggleThread && window.innerWidth < 1400) {
      this.toggleThread = false;
    }
    this.toggleMenu = !this.toggleMenu;
  }

  overlayBackroundColor() {
    this.toggleBackground = true;
  }

  closeWindow() {
    if (this.toggleEditChannel || this.toggleEditMembers || this.toggleAddNewMembers || this.toggleProfile) { }
    this.toggleProfile = false;
    this.toggleEditChannel = false;
    this.toggleEditMembers = false;
    this.toggleAddNewMembers = false;
    this.toggleBackground = false;
  }

  checkWindowWidth1400(): void {
    if (window.innerWidth <= 1400 && this.toggleMenu) {
      this.toggleThread = false;
    }
  }

  
}
