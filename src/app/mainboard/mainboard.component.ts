import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { onSnapshot } from '@firebase/firestore';
import { MenuComponent } from '../mainboard-components/menu/menu.component';



@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss']
})
export class MainboardComponent {
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
  userArray: Array<string> = [];
  unsubUsers;
  unsubChannels;


  constructor() {
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
  }


  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        let array = element.data();
        this.userArray.push(array['username'])
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

}
