import { Component, ElementRef, HostListener, Injectable, ViewChild, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class MainboardComponent {

  @ViewChild('thread') thread!: ElementRef;

  userId: string = '';

  toggleMenu: boolean = true;
  toggleThread: boolean = false;
  toggleEditChannel: boolean = false;
  toggleEditMembers: boolean = false;
  toggleAddNewMembers: boolean = false;
  toggleBackground: boolean = false;
  toggleProfile: boolean = false;

  isPopupForThreadVisible: boolean = false;
  isPopupForReactionsVisible: boolean = false;

  loggedInUserName: string = '';
  loggedInUserImg: string = '';

  selectedChannelTitle: string = 'Entwicklerteam';
  selectedChannelDescription: string = 'Das ist der eine Channel, der immer alle einbezieht. Es ist ein toller Ort für Mitteilungen und Unterhaltungen';

  channelID: string = 'nq56l3iiTG4g3e1iNHHm';
  channelsArray: any[] = [];

  selectedChannelContent: any[] = [];

  img: string = '';
  userArray: any[] = [];

  firestore: Firestore = inject(Firestore);
  unsubUsers;
  unsubChannels;

  constructor(private route: ActivatedRoute) {
    this.channelContent();
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth1400();
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


  //----Subscribee-Functions----//
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let idParam = params.get('ref')
      this.userId = idParam !== null ? idParam : '';
    });
  }

  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      list.forEach(element => {
        if (element.data()['defaultImg'] && element.data()['defaultImg'].length >= 1) {
          this.img = element.data()['defaultImg'];
        } else {
          this.img = element.data()['personalImg'];
        }
        if (element.id == this.userId) {
          this.loggedInUserName = element.data()['username'];
          this.loggedInUserImg = this.img;
        } else {
          this.userArray.push({
            username: element.data()['username'],
            id: element.id, img: this.img
          });
        }
      })
    })
  }

  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      list.forEach(element => {
        this.channelsArray.push({
          channelName: element.data()['name'],
          channelDescription: element.data()['description']
        });
      });
    });
  }

  usersRef() {
    return collection(this.firestore, 'users');
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  async channelContent() {
    let channel = await getDocs(collection(this.firestore, 'channels', this.channelID, 'channelContent'));
    this.selectedChannelContent = [];
    channel.forEach((doc) => {
      this.selectedChannelContent.push({
        id: doc.id,
        data: doc.data(),
      });
    });
  }

  testref() {
    return collection(this.firestore, 'channelContent')
  }

  ngonDestroy() {
    this.unsubUsers();
    this.unsubChannels();
  }


  //----Helpfunctions----//
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
