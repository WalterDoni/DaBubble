import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-inputfield-normail-chat',
  templateUrl: './inputfield-normail-chat.component.html',
  styleUrls: ['./inputfield-normail-chat.component.scss']
})

export class InputfieldNormailChatComponent {

  showNewCommentImg: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;
  customizedImg: boolean = false;
  
  //-Image upload--//
  uploadedImg: any = {};
  @ViewChild('uploadmessage') uploadmessage!: ElementRef;
  displayUploadMessage: boolean = false;
  @ViewChild('newCommentValue') newCommentValue!: ElementRef;

  constructor(public mainboard: MainboardComponent, public storage: Storage, private cdr: ChangeDetectorRef) {
  }
  
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
    this.mainboard.selectedUrl = "";
    this.cdr.detectChanges();
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
            this.mainboard.selectedUrl = downloadURL;
            this.cdr.detectChanges();
          }
        });
      }
    );
  }

  /**
* Asynchronously adds a new comment to the selected channel.
*/
  async newCommentInSelectedChannel() {
    debugger
    let input = this.newCommentValue.nativeElement.value;
    await addDoc(this.mainboard.channelContentRef(), this.valuesForNewComment(input));
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
      from: this.mainboard.loggedInUserName,
      message: input,
      messageImg: this.mainboard.selectedUrl,
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

  toogleDisplayAllChannelMembers() {
    this.mainboard.displayMembers = !this.mainboard.displayMembers
  }

}
