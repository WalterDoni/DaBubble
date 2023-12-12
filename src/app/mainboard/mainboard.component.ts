import { Component, ElementRef, HostListener, Inject, Injectable, ViewChild, inject, LOCALE_ID } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss'],
  providers: [DatePipe]
})

@Injectable({
  providedIn: 'root',
})

export class MainboardComponent {

  date: Date = new Date(Date.now());
  @ViewChild('thread') thread!: ElementRef;

  reactionEmoji: any;
  userId: string = '';

  toggleMenu: boolean = true;
  toggleThread: boolean = false;
  toggleEditChannel: boolean = false;
  toggleEditMembers: boolean = false;
  toggleAddNewMembers: boolean = false;
  toggleBackground: boolean = false;
  toggleProfile: boolean = false;
  toggleProfileView: boolean = false;

  chatContent: boolean = true;
  directMessageContent: boolean = false;
  menuSearchfieldChat: boolean = false;

  isPopupForThreadVisible: boolean = false;
  hoveredChannelIndex!: number;
  isPopupForReactionsVisible: boolean = false;

  loggedInUserName: string = '';
  loggedInUserImg: string = '';
  loggedInUserEmail: string = '';

  selectedChannelTitle: string = 'Entwicklerteam';
  selectedChannelDescription: string = 'Das ist der eine Channel, der immer alle einbezieht. Es ist ein toller Ort für Mitteilungen und Unterhaltungen';
  selectedUserDirectMessageImage: string = '';
  selectedUserDirectMessageName: string = '';

  channelID: string = 'nq56l3iiTG4g3e1iNHHm';
  channelsArray: any[] = [];

  selectedChannelContent: any[] = [];

  img: string = '';
  userArray: any[] = [];

  searchTerm!: string;
  filteredUserArray: any[] = [];
  filteredChannelsArray: any[] = [];

  searchTermMenu!: string;
  filteredUserArrayMenu: any[] = [];
  filteredChannelsArrayMenu: any[] = [];

  firestore: Firestore = inject(Firestore);
  unsubUsers;
  unsubChannels;

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string) {
    this.channelContent();
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();

  }

  getFormattedDate(): string {
    return this.datePipe.transform(this.date, 'EEEE, d MMMM', this.locale) as string;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth1400();
  }

  //--Thread-Popup--//
  showPopupForThread(event: MouseEvent, index: number) {
    this.hoveredChannelIndex = index;
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

  //----Search-Function----//
  search(): void {
    if (this.searchTerm && this.searchTerm.length >= 1) {
      this.filteredUserArray = this.userArray.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredChannelsArray = this.channelsArray.filter(user =>
        user.channelName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUserArray = [];
      this.filteredChannelsArray = [];
    }
  }

  searchfieldAtChat() {
    if (this.searchTermMenu && this.searchTermMenu.length >= 1) {
      this.filteredUserArrayMenu = this.userArray.filter(user =>
        user.username.toLowerCase().includes(this.searchTermMenu.toLocaleLowerCase())
      );
      this.filteredChannelsArrayMenu = this.channelsArray.filter(user =>
        user.channelName.toLowerCase().includes(this.searchTermMenu.toLowerCase())
      );
    } else {
      this.filteredChannelsArrayMenu = [];
      this.filteredUserArrayMenu = [];
    }
  }

  selectChannelSearchfield(channelName: string) {
    this.chatContent = true;
    this.directMessageContent = false;
    this.menuSearchfieldChat = false;
    for (let i = 0; i < this.channelsArray.length; i++) {
      if (this.channelsArray[i]['channelName'] == channelName) {
        this.selectedChannelTitle = this.channelsArray[i].channelName;
        this.selectedChannelDescription = this.channelsArray[i].channelDescription;
        this.channelID = this.channelsArray[i].channelId;
        this.channelContent();
      }
    }
  }


  selectUserSearchfield(username: string) {
    this.directMessageContent = true;
    this.menuSearchfieldChat = false;
    this.chatContent = false;
    for (let i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i]['username'] == username) {
        this.selectedUserDirectMessageImage = this.userArray[i].img;
        this.selectedUserDirectMessageName = this.userArray[i].username;
      }
    }
  }




  /* async searchBarSelectChannel(channelName: string) {
    for (let i = 0; i < this.channelsArray.length; i++) {
      let channel = this.channelsArray[i];
      if (channel.channelName === channelName) {
        this.selectedChannelTitle = channel.channelName;
        this.selectedChannelDescription = channel.channelDescription;
        this.channelID = channel.channelId;
        this.channelContent();
      }
    }
  } */

  //----Subscribe-Functions----//
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
          this.loggedInUserEmail = element.data()['email'];
          this.loggedInUserImg = this.img;
        } else {
          this.userArray.push({
            username: element.data()['username'],
            id: element.id, img: this.img
          });
          console.log(this.userArray);
        }
      })
    })

  }

  subChannels() {
    return onSnapshot(this.channelsRef(), (list) => {
      list.forEach(element => {
        this.channelsArray.push({
          channelName: element.data()['name'],
          channelDescription: element.data()['description'],
          channelId: element.id,
        });
        console.log(this.channelsArray);
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
    if (this.toggleEditChannel || this.toggleEditMembers || this.toggleAddNewMembers || this.toggleProfile || this.toggleProfileView) { }
    this.toggleProfile = false;
    this.toggleEditChannel = false;
    this.toggleEditMembers = false;
    this.toggleAddNewMembers = false;
    this.toggleBackground = false;
    this.toggleProfileView = false;
  }

  checkWindowWidth1400(): void {
    if (window.innerWidth <= 1400 && this.toggleMenu) {
      this.toggleThread = false;
    }
  }


}
