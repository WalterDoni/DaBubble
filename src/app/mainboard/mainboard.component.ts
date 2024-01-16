import { Component, ElementRef, HostListener, Inject, Injectable, ViewChild, inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewComment } from '../models/newComment';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
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
  @ViewChild('newChangedMessage') newChangedMessage!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('delImgEditComment') delImgEditComment!: ElementRef;
  @ViewChild('newCommentValuePrivateMessage') newCommentValuePrivateMessage!: ElementRef;

  reactionEmoji: any;
  userId: string = '';

  //-Image upload--//
  uploadedImg: any = {};
  selectedUrl: string = '';
  customizedImg: boolean = false;
  @ViewChild('uploadmessage') uploadmessage!: ElementRef;
  displayUploadMessage: boolean = false;

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
  showNewCommentImg: boolean = false;
  errorMessageCommentChange: boolean = false;

  //--Searchfiltervariables--//
  searchTerm!: string;
  filteredUserArray: any[] = [];
  filteredChannelsArray: any[] = [];
  searchTermChannelMember!: string;
  filteredMemberArray: any[] = [];
  searchTermMenu!: string;
  filteredUserArrayMenu: any[] = [];
  filteredChannelsArrayMenu: any[] = [];
  menuSearchfieldChat: boolean = false;

  //--Private-Messages--//
  messageFromArray: any[] = [];
  messageTextArray: any[] = [];
  messageTimeArray: any[] = [];
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

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string, public storage: Storage, private cdr: ChangeDetectorRef) {
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

  //----Search-Function----//

  /**
 * Searches for users and channels based on the provided search term.
 * Filters user and channel arrays based on the search term, updating the corresponding filtered arrays.
 */
  search() {
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

  /**
 * Adds members to a channel based on the provided search term.
 * Filters user array for members based on the search term, updating the filtered members array.
 */
  addMemberToChannelSearch() {
    if (this.searchTermChannelMember && this.searchTermChannelMember.length >= 1) {
      this.filteredMemberArray = this.userArray.filter(user =>
        user.username.toLowerCase().includes(this.searchTermChannelMember.toLowerCase())
      )
    } else {
      this.filteredMemberArray = [];
    }
  }

  /**
 * Searches for users and channels in the chat menu based on the provided search term.
 * Filters user and channel arrays in the chat menu based on the search term, updating the corresponding filtered arrays.
 */
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

  /**
 * Selects a channel in the chat based on the provided channel name.
 */
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

  /**
 * Selects a user for direct messages based on the provided username.
 * @param {string} username - The username of the selected user.
 */
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

  //------Every necessary function at the Inputfield-----//
  //----New-Comment-Functions----// 

  /**
 * Asynchronously adds a new comment to the selected channel.
 */
  async newCommentInSelectedChannel() {
    let input = this.newCommentValue.nativeElement.value;
    await addDoc(this.channelContentRef(), this.valuesForNewComment(input));
    this.newCommentValue.nativeElement.value = '';
  }

  valuesForNewComment(input: string) {
    return {
      answerFrom: [],
      answerText: [],
      answerTime: [],
      emoji: [],
      emojiBy: [],
      emojiCounter: [],
      answers: 0,
      from: this.loggedInUserName,
      message: input,
      messageImg: this.selectedUrl,
      messageTime: new Date(),
      timestamp: this.getCurrentTimeInMEZ(),
    }
  }

  /**
   * Gets the current time in Central European Time (MEZ/CEST).
   * @returns {string} The current time formatted as 'HH:mm' in the Europe/Berlin time zone.
   */
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

  /**
 * Handles the upload of an image.
 * @param {Object} event - The event object representing the file input change.
 */
  uploadImg(event: any) {
    this.uploadedImg = event.target.files[0];
    this.saveInStorage();
  }

  /**
   * Deletes the newly added image in the comment.
   */
  deleteNewImgInComment() {
    this.showNewCommentImg = false;
    this.selectedUrl = "";
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  /**
 * Saves the uploaded image in storage and updates the Inputfield based on the upload progress.
 */
  saveInStorage() {
    let storageRef = ref(this.storage, this.uploadedImg.name);
    let uploadTask = uploadBytesResumable(storageRef, this.uploadedImg)
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedImageTypes.includes(this.uploadedImg.type)) {
      alert('Ungültiger Dateityp. Es sind nur JPEG, PNG und GIF erlaubt.');
      return;
    }
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.displayUploadMessage = true;
        if (this.uploadmessage && this.uploadmessage.nativeElement) {
          this.uploadmessage.nativeElement.textContent = 'Das Bild ist zu ' + Math.round(progress) + '% hochgeladen';
        }
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
        }
      },
      (error) => {
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.displayUploadMessage = false;
          console.log('File available at', downloadURL);
          if (downloadURL) {
            this.showNewCommentImg = true;
            this.customizedImg = true;
            this.selectedUrl = downloadURL;
            this.cdr.detectChanges();
          }
        });
      }
    );
  }

  selectedNameIntoInputfield(name: string) {
    this.displayMembers = false;
    this.newCommentValue.nativeElement.value += name;
  }

  //------Private-Message-Functions-----//

  /**
 * Adds a new comment to the selected private message channel.
 * If newChannel is true, there is no created Private channel in the database and a new one will be created.
 */
  async newCommentInSelectedPrivateChannel() {
    let input = this.newCommentValuePrivateMessage.nativeElement.value;
    this.messageTextArray.push(input);
    this.messageFromArray.push(this.loggedInUserName);
    let timestamp = Timestamp.now();
    this.messageTimeArray.push(timestamp);
    let newChannel = true;
    this.privateChannelArray.forEach(channel => {
      this.updateSelectedPrivateMessageChannel(channel);
      newChannel = false;
    });
    if (newChannel) {
      await this.createNewPrivateChannel(input);
    }
    this.newCommentValuePrivateMessage.nativeElement.value = '';
  }

  /**
   * Check if the current channel includes the loggedInUser and the choosen user. If there is a match, update the channel.
   */
  async updateSelectedPrivateMessageChannel(channel: any) {
    if (channel.messageBetween.includes(this.loggedInUserName) && channel.messageBetween.includes(this.selectedUserDirectMessageName)) {
      this.channelIdPrivate = channel.privateChannelId;
      await updateDoc(doc(this.privateChannelRef(), this.channelIdPrivate), {
        messageFrom: this.messageFromArray,
        messageText: this.messageTextArray,
        messageTime: this.messageTimeArray,
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
    await addDoc(this.privateChannelRef(), {
      messageBetween: memberArray,
      messageFrom: this.messageFromArray,
      messageText: this.messageTextArray,
      messageTime: this.messageTimeArray,
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
        this.channelIdPrivate = channel.id;
        this.getMessageFromArray(i);
        this.getmessageTextArrayArray(i);
        this.getmessageTimeArray(i);
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

  clearArrays() {
    this.messageFromArray = [];
    this.messageTextArray = [];
    this.messageTimeArray = [];
  }

  //----Change-Comment-Functions----//

  /**
 * Saves changes to a comment in the selected channel.
 * @param {string} id - The ID of the comment to be updated.
 * @param {number} index - The index of the comment in the array.
 */
  async saveCommentChange(id: string, index: number) {
    if (this.newChangedMessage.nativeElement.value.length >= 1) {
      let newMessage = this.newChangedMessage.nativeElement.value;
      let img = this.delImgEditComment.nativeElement.src
      await updateDoc(doc(this.channelContentRef(), id), {
        message: newMessage,
        messageImg: img
      })
      this.selectedChannelContent[index].editComment = false;
      this.errorMessageCommentChange = false;
    } else {
      this.errorMessageCommentChange = true;
    }
  }

  deleteImgEditComment() {
    this.delImgEditComment.nativeElement.src = "";
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

  /**
   * Remove the selected emoji, if user has allready selected one.
   */
  async removeEmoji(index: number) {
    debugger
    let { emojiContainer, emojiByContainer, emojiCounterContainer } = this.referencesEmoji();
    let id = this.selectedChannelContent[this.hoveredChannelIndex]['id'];
    if (emojiByContainer.includes(this.loggedInUserName)) {
      this.updateremoveEmojiContainers(emojiByContainer, emojiCounterContainer, emojiContainer, index);
    }
    await updateDoc(doc(this.channelContentRef(), id), {
      emoji: emojiContainer,
      emojiBy: emojiByContainer,
      emojiCounter: emojiCounterContainer,
    })
  }

  /**
   * Will be called in the removeEmoji function. Iterate through the emojiByContainer.
   * First: Check if the loggedInUser is allready in the array. Yes -> remove it.
   * Second: Check the amount of the emoji. Remove it, if the amount is 1. If it is more then 1 reduce by 1.
  */
  updateremoveEmojiContainers(emojiByContainer: any, emojiCounterContainer: any, emojiContainer: any, index: number) {
    emojiByContainer.forEach((name: string, i: number) => {
      if (name == this.loggedInUserName) {
        emojiByContainer.splice(i, 1);
        if (emojiCounterContainer[index] > 1) {
          emojiCounterContainer[index] = emojiCounterContainer[index] - 1;
        } else {
          emojiCounterContainer.splice(index, 1);
          emojiContainer.splice(index, 1);
        }
      }
    });
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
        this.selectedChannelTitle = this.channelsArray[0]['channelName'];
        this.selectedChannelDescription = this.channelsArray[0]['channelDescription'];
        this.selectedChannelCreated = this.channelsArray[0]['channelCreated'];
        this.channelID = this.channelsArray[0]['channelId'];
        this.getChannelMembersFromSelectedChannel();
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
  showPopupForReactions(event: MouseEvent, index: number): void {
    this.hoveredEmojiIndex = index;
    this.isPopupForReactionsVisible = true;

  }

  hidePopupForReactions(): void {
    this.hoveredEmojiIndex = null;
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

  toogleDisplayAllChannelMembers() {
    this.displayMembers = !this.displayMembers
  }

}
