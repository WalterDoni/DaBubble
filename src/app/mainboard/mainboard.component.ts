import { Component, ElementRef, HostListener, Inject, Injectable, ViewChild, inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewComment } from '../models/newComment';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

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
  @ViewChild('newCommentValue') newCommentValue!: ElementRef;
  @ViewChild('newChangedMessage') newChangedMessage!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  reactionEmoji: any;
  userId: string = '';

  uploadedImg: any = {};
  selectedUrl: string = '';
  customizedImg: boolean = false;
  

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
  editCommentPopUp: boolean = false;
  hoveredChannelIndex!: number;
  isPopupForReactionsVisible: boolean = false;

  loggedInUserName: string = '';
  loggedInUserImg: string = '';
  loggedInUserEmail: string = '';

  selectedChannelTitle: string = '';
  selectedChannelDescription: string = '';
  selectedChannelCreated: string = '';
  selectedUserDirectMessageImage: string = '';
  selectedUserDirectMessageName: string = '';

  channelID: string = 'nq56l3iiTG4g3e1iNHHm';
  channelsArray: any[] = [];

  selectedChannelContent: any[] = [];

  newComment = new NewComment();

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
  unsubChannelContent;

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string,public storage: Storage, private cdr: ChangeDetectorRef) {
    this.channelContent();
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
    this.unsubChannelContent = this.channelContent()
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

  //--Edit-Comment-Pop-Up--//
  showPopUpForEditComment(event: MouseEvent, index: number) {
    this.hoveredChannelIndex = index;
    this.editCommentPopUp = true;
  }

  hidePopUpForEditComment() {
    this.editCommentPopUp = true;
  }

  closeEditComment(index: number) {
    this.selectedChannelContent[index].editComment = false;
  }

  //--Reactions-Popup--//
  showPopupForReactions(event: MouseEvent) {
    this.isPopupForReactionsVisible = true;
  }

  hidePopupForReactions() {
    this.isPopupForReactionsVisible = false;
  }

  //--Edit-Channel-Window--//
  openChangeChannelPopUp() {
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
        this.selectedChannelCreated = this.channelsArray[i].channelCreated;
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

  //----New-Comment-Functions----// 

  async newCommentInSelectedChannel() {
    let input = this.newCommentValue.nativeElement.value;
    await addDoc(this.channelContentRef(), {
      answerFrom: [],
      answerText: [],
      answerTime: [],
      answers: 0,
      from: this.loggedInUserName,
      message: input,
      messageImg: this.selectedUrl,
      messageTime: new Date(),
      timestamp: this.getCurrentTimeInMEZ(),
    });
  }

  getCurrentTimeInMEZ() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Berlin',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    };
    return now.toLocaleTimeString('de-DE', options);
  }

  //----Img Upload----//
    uploadImg(event: any) {
      this.uploadedImg = event.target.files[0];
      this.saveInStorage();
    }

    triggerFileInput() {
      this.fileInput.nativeElement.click();
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
  

  //----Change-Comment-Functions----//
  async saveCommentChange(id: string, index: number) {
    let newMessage = this.newChangedMessage.nativeElement.value;
    await updateDoc(doc(this.channelContentRef(), id), {
      message: newMessage,
    })
    this.selectedChannelContent[index].editComment = false;
  }

  //----Subscribe-Functions----//
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let idParam = params.get('ref')
      this.userId = idParam !== null ? idParam : '';
    });
  }

  subUsers() {
    return onSnapshot(this.usersRef(), (list) => {
      this.userArray = [];
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
        this.channelsArray.push({
          channelName: element.data()['name'],
          channelDescription: element.data()['description'],
          channelCreated: element.data()['created'],
          channelId: element.id,
        });
        this.selectedChannelTitle = this.channelsArray[0]['channelName'];
        this.selectedChannelDescription = this.channelsArray[0]['channelDescription'];
        this.selectedChannelCreated = this.channelsArray[0]['channelCreated'];
        this.channelID = this.channelsArray[0]['channelId'];
        this.channelContent();
      });
    });
  }

  channelsRef() {
    return collection(this.firestore, 'channels');
  }

  channelContent() {
    return onSnapshot(this.channelContentRef(), (list) => {
      this.selectedChannelContent = [];
      list.forEach(element => {
        let answerTimeArray = element.data()['answerTime'];
        this.selectedChannelContent.push({
          id: element.id,
          data: element.data(),
          editComment: false,
          lastAnswer: answerTimeArray[answerTimeArray.length - 1],
        });
      });
    });
  }

  channelContentRef() {
    return collection(this.firestore, 'channels', this.channelID, 'channelContent')
  }

  ngonDestroy() {
    this.unsubUsers();
    this.unsubChannels();
    this.unsubChannelContent();
  }

  //----Helpfunctions----//
  getImgFromAnswerUser(username: string) {
    const user = this.userArray.find(user => user.username === username);
    return user ? user.img : '/assets/img/signup/profile.png';
  }

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
