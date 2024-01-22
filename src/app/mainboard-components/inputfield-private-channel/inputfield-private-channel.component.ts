import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-inputfield-private-channel',
  templateUrl: './inputfield-private-channel.component.html',
  styleUrls: ['./inputfield-private-channel.component.scss']
})
export class InputfieldPrivateChannelComponent {
  @ViewChild('uploadmessagePrivate') uploadmessagePrivate!: ElementRef;
  @ViewChild('newCommentValuePrivateMessage') newCommentValuePrivateMessage!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  //-Image upload--//
  uploadedImg: any = {};
  
  privateshowNewCommentImg: boolean = false;

  privatedisplayUploadMessage: boolean = false;
  customizedImg: boolean = false;

  constructor(public mainboard: MainboardComponent, public storage: Storage, private cdr: ChangeDetectorRef) {
  }

  /**
 * Adds a new comment to the selected private message channel.
 * If newChannel is true, there is no created Private channel in the database and a new one will be created.
 */
  async newCommentInSelectedPrivateChannel() {
    let input = this.newCommentValuePrivateMessage.nativeElement.value;
    if(input.length == 0){ alert('Bitte eine Nachricht eingeben'); return}
    this.mainboard.messageTextArray.push(input);
    this.mainboard.messageFromArray.push(this.mainboard.loggedInUserName);
    let timestamp = Timestamp.now();
    this.mainboard.messageTimeArray.push(timestamp);
    this.mainboard.messageImgArray.push(this.mainboard.selectedUrl)
    let channelInfo = { newChannel: true };
    this.mainboard.privateChannelArray.forEach(channel => {
      this.mainboard.updateSelectedPrivateMessageChannel(channel, channelInfo);
    });
    if (channelInfo.newChannel) {
      await this.mainboard.createNewPrivateChannel(input);
    }
    this.newCommentValuePrivateMessage.nativeElement.value = '';
    this.deleteNewImgInComment();
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
    this.privateshowNewCommentImg = false;
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
        this.privatedisplayUploadMessage = true;
        if (this.uploadmessagePrivate && this.uploadmessagePrivate.nativeElement) {
          this.uploadmessagePrivate.nativeElement.textContent = 'Das Bild ist zu ' + Math.round(progress) + '% hochgeladen';
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
          this.privatedisplayUploadMessage = false;
          console.log('File available at', downloadURL);
          if (downloadURL) {
            this.privateshowNewCommentImg = true;
            this.customizedImg = true;
            this.mainboard.selectedUrl = downloadURL;
            this.cdr.detectChanges();
          }
        });
      }
    );
  }

}
