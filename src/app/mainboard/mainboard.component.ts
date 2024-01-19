import { Component, ElementRef, HostListener, Inject, Injectable, ViewChild, inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewComment } from '../models/newComment';

import { Timestamp } from 'firebase/firestore';

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
  @ViewChild('newCommentValuePrivateMessage') newCommentValuePrivateMessage!: ElementRef;
  @ViewChild('newChangedMessage') newChangedMessage!: ElementRef;
  @ViewChild('delImgEditComment') delImgEditComment!: ElementRef;

  reactionEmoji: any;
  userId: string = '';

  //-Image upload--//
  uploadedImg: any = {};
  selectedUrl: string = '';

  //--Toggle variables - Show and hide elements--//
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
  isPopupForThreadVisible: boolean = false;
  editCommentPopUp: boolean = false;
  isPopupForReactionsVisible: boolean = false;
  displayMembers: boolean = false;

  //--Variables for logged in user--//
  loggedInUserName: string = '';
  loggedInUserImg: string = '';
  loggedInUserEmail: string = '';

  //--Selection for menu(sidebar)--//
  selectedChannelTitle: string = '';
  selectedChannelDescription: string = '';
  selectedChannelCreated: string = '';
  selectedUserDirectMessageImage: string = '';
  selectedUserDirectMessageName: string = '';
  selectedChannelContent: any[] = [];
  selectedChannelMembersArray: any[] = [];

  //--new comment or commentchange--//
  newComment = new NewComment();

  filteredMemberArray: any[] = [];
  menuSearchfieldChat: boolean = false;
  searchTermChannelMember!: string;

  //--Private-Messages--//
  messageFromArray: any[] = [];
  messageTextArray: any[] = [];
  messageTimeArray: any[] = [];
  messageImgArray: any[] = [];
  channelIdPrivate!: string;
  displayMessages: boolean = false;
  privateChannelArray: any[] = [];

  hoveredEmojiIndex: number | null = null;
  hoveredChannelIndex!: number;

  //--Firestore database--//
  firestore: Firestore = inject(Firestore);
  unsubUsers;
  unsubChannels;
  unsubChannelContent;
  unsubprivateChannel;

  //--arrays for database -- and standard channelID to display content--//
  userArray: any[] = [];
  channelID: string = 'nq56l3iiTG4g3e1iNHHm';
  channelsArray: any[] = [];

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string) {
    this.channelContent();
    this.unsubUsers = this.subUsers();
    this.unsubChannels = this.subChannels();
    this.unsubChannelContent = this.channelContent();
    this.unsubprivateChannel = this.subprivateChannel();
  }

  /**
  * Returns the formatted date in the specified format.
  * @returns {string} The formatted date.
  */
  getFormattedDate(): string {
    return this.datePipe.transform(this.date, 'EEEE, d MMMM', this.locale) as string;
  }

  /**
   * @HostListener decorator for handling the 'window:resize' event.
   * Listens for the window resize event and triggers the 'checkWindowWidth1400' method.
   * @param {Event} $event - The event object associated with the window resize.
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth1400();
  }

  /**
   * Check if the current channel includes the loggedInUser and the choosen user. If there is a match, update the channel.
   */
  async updateSelectedPrivateMessageChannel(channel: any, channelInfo: { newChannel: boolean }) {
    if (channel.messageBetween.includes(this.loggedInUserName) && channel.messageBetween.includes(this.selectedUserDirectMessageName)) {
      channelInfo.newChannel = false;
      this.channelIdPrivate = channel.privateChannelId;
      await updateDoc(doc(this.privateChannelRef(), this.channelIdPrivate), {
        messageFrom: this.messageFromArray,
        messageText: this.messageTextArray,
        messageTime: this.messageTimeArray,
        messageImg: this.messageImgArray,
      });
    }
  }

  /**
  * Triggers when in newCommentInSelectedPrivateChannel() the variable newChannel is set on true.
  * Push the new values in the current arrays. After that add a new document in the private channel.
  */
  async createNewPrivateChannel(input: string) {
    await this.clearArrays();
    let memberArray: any[] = [];
    memberArray.push(this.loggedInUserName);
    memberArray.push(this.selectedUserDirectMessageName);
    this.messageTextArray.push(input);
    this.messageFromArray.push(this.loggedInUserName);
    let timestamp = Timestamp.now();
    this.messageTimeArray.push(timestamp);
    this.messageImgArray.push(this.selectedUrl);
    await addDoc(this.privateChannelRef(), {
      messageBetween: memberArray,
      messageFrom: this.messageFromArray,
      messageText: this.messageTextArray,
      messageTime: this.messageTimeArray,
      messageImg: this.messageImgArray,
    })
  }

  /**
 * Gets the ID of the selected private channel between the logged-in user and another user.
 * @param {string} name - The name of the other user in the private channel.
 */
  getSelectedPrivateChannelId(name: string) {
    for (let i = 0; i < this.privateChannelArray.length; i++) {
      let channel = this.privateChannelArray[i];
      if (channel.messageBetween.includes(this.loggedInUserName) && channel.messageBetween.includes(name)) {
        this.channelIdPrivate = channel.privateChannelId;
        this.getMessageFromArray(i);
        this.getmessageTextArrayArray(i);
        this.getmessageTimeArray(i);
        this.getMessageImgArray(i);
        break;
      } else {
        this.clearArrays();
      }
    }
  }


  async getMessageFromArray(index: number) {
    let FromArray: any[] = [];
    await this.privateChannelArray[index].messageFrom.forEach((list: any) => {
      FromArray.push(list)
    });
    this.messageFromArray = FromArray;
  }

  async getmessageTextArrayArray(index: number) {
    let TextArray: any[] = [];
    await this.privateChannelArray[index].messageText.forEach((list: any) => {
      TextArray.push(list)
    });
    this.messageTextArray = TextArray;
  }

  async getmessageTimeArray(index: number) {
    let TimeArray: any[] = [];
    await this.privateChannelArray[index].messageTime.forEach((list: any) => {
      TimeArray.push(list)
    });
    this.messageTimeArray = TimeArray;
  }

  async getMessageImgArray(index: number) {
    let MessageImg: any[] = [];
    await this.privateChannelArray[index].messageImg.forEach((list: any) => {
      MessageImg.push(list)
    });
    this.messageImgArray = MessageImg;
  }

  clearArrays() {
    this.messageFromArray = [];
    this.messageTextArray = [];
    this.messageTimeArray = [];
    this.messageImgArray = [];
  }

  checkIfLoggedInUserIsInWelcomeChannel() {
    let member = this.channelsArray[0]['members']
    if (!this.channelsArray[0]['members'].includes(this.loggedInUserName)) { 
      member.push(this.loggedInUserName)
      updateDoc(doc(this.channelsRef(), '1111e9vycY0UF2uxnAAd'), {
        members: member
      });
    }
  }

  //----Update-Emoji-Counter----//

  /**
 * Updates emojis for the selected channel content.
 */
  async updateEmojis() {
    let { emojiContainer, emojiByContainer, emojiCounterContainer } = this.referencesEmoji();
    let id = this.selectedChannelContent[this.hoveredChannelIndex]['id'];
    if (!emojiByContainer.includes(this.loggedInUserName)) {
      this.reduceAmountOrPushInEmojiContainers(emojiContainer, emojiCounterContainer);
      emojiByContainer.push(this.loggedInUserName);
      await updateDoc(doc(this.channelContentRef(), id), {
        emoji: emojiContainer,
        emojiBy: emojiByContainer,
        emojiCounter: emojiCounterContainer,
      })
    } else {
      alert('Bitte nur ein Emoji pro Kommentar auswählen')
    }
  }

  /**
   * Check if the selected emoji is in the current emojiContainer. If yes add one to the current amount and if not
   * push the new one into both necessary arrays.
   */
  reduceAmountOrPushInEmojiContainers(emojiContainer: any, emojiCounterContainer: any) {
    if (emojiContainer.includes(this.reactionEmoji)) {
      emojiContainer.forEach((element: string, id: number) => {
        if (element == this.reactionEmoji) {
          emojiCounterContainer[id] = emojiCounterContainer[id] + 1;
        }
      });
    } else {
      emojiCounterContainer.push(1);
      emojiContainer.push(this.reactionEmoji);
    }
  }

  referencesEmoji() {
    return {
      emojiContainer: this.selectedChannelContent[this.hoveredChannelIndex]['emoji'],
      emojiByContainer: this.selectedChannelContent[this.hoveredChannelIndex]['emojiBy'],
      emojiCounterContainer: this.selectedChannelContent[this.hoveredChannelIndex]['emojiCounter']
    };
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
      let img = "";
      list.forEach(element => {
        if (element.data()['defaultImg'] && element.data()['defaultImg'].length >= 1) {
          img = element.data()['defaultImg'];
        } else {
          img = element.data()['personalImg'];
        }
        if (element.id == this.userId) {
          this.loggedInUserName = element.data()['username'];
          this.loggedInUserEmail = element.data()['email'];
          this.loggedInUserImg = img;
        } else {
          this.userArray.push({
            username: element.data()['username'],
            id: element.id,
            img: img,
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
          members: element.data()['members'],
          channelId: element.id,
        });
        this.checkIfLoggedInUserIsInWelcomeChannel();
        this.selectedChannelTitle = this.channelsArray[0]['channelName'];
        this.selectedChannelDescription = this.channelsArray[0]['channelDescription'];
        this.selectedChannelCreated = this.channelsArray[0]['channelCreated'];
        this.channelID = this.channelsArray[0]['channelId'];
        this.getChannelMembersFromSelectedChannel();
        this.channelContent();
        console.log(this.channelsArray);

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
          emoji: element.data()['emoji'],
          emojiBy: element.data()['emojiBy'],
          emojiCounter: element.data()['emojiCounter'],
          answers: element.data()['answerFrom'].length,
          editComment: false,
          lastAnswer: answerTimeArray[answerTimeArray.length - 1],
        });
      });
    });
  }

  channelContentRef() {
    return collection(this.firestore, 'channels', this.channelID, 'channelContent')
  }

  subprivateChannel() {
    return onSnapshot(this.privateChannelRef(), (list) => {
      this.privateChannelArray = [];
      list.forEach(element => {
        this.privateChannelArray.push({
          messageBetween: element.data()['messageBetween'],
          messageFrom: element.data()['messageFrom'],
          messageText: element.data()['messageText'],
          messageTime: element.data()['messageTime'],
          messageImg: element.data()['messageImg'],
          privateChannelId: element.id,
        })
      });
    })
  }

  privateChannelRef() {
    return collection(this.firestore, 'private-channels')
  }

  ngOnDestroy() {
    this.unsubUsers();
    this.unsubChannels();
    this.unsubChannelContent();
    this.unsubprivateChannel();
  }

  //--Other-functions--SORT AND DESCRIPE!!!!--//

  getChannelMembersFromSelectedChannel() {
    this.selectedChannelMembersArray = [];
    this.channelsArray.forEach(channel => {
      if (channel.channelId == this.channelID) {
        channel.members.forEach((member: any) => {
          if (member == this.loggedInUserName) {
            this.selectedChannelMembersArray.push({
              member: this.loggedInUserName,
              img: this.loggedInUserImg,
            })
          }
          this.userArray.forEach(user => {
            if (user.username == member) {
              this.selectedChannelMembersArray.push({
                member: user.username,
                img: user.img
              })
            }
          });
        });
      }
    });
  }

  //----Helpfunctions----//

  getImgFromAnswerUser(username: string) {

    if (this.userArray.length >= 1) {
      const user = this.userArray.find(user => user.username === username);
      return user ? user.img : '/assets/img/signup/profile.png';
    }
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

}
