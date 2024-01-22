import { Component } from '@angular/core';
import { doc, updateDoc } from '@angular/fire/firestore';
import { MainboardComponent } from '../mainboard/mainboard.component';

@Component({
  selector: 'app-message-content',
  templateUrl: './message-content.component.html',
  styleUrls: ['./message-content.component.scss']
})
export class MessageContentComponent {

  errorMessageCommentChange: boolean = false;
  isPopupForReactionsVisible: boolean = false;

  constructor(public mainboard: MainboardComponent) { }


  //--Thread-Popup--//
  showPopupForThread(event: MouseEvent, index: number) {
    this.mainboard.hoveredChannelIndex = index;
    this.mainboard.isPopupForThreadVisible = true;
  }

  hidePopupForThread() {
    this.mainboard.isPopupForThreadVisible = false;
  }

  //--Edit-Comment-Pop-Up--//
  showPopUpForEditComment(event: MouseEvent, index: number) {
    this.mainboard.hoveredChannelIndex = index;
    this.mainboard.editCommentPopUp = true;
  }

  hidePopUpForEditComment() {
    this.mainboard.editCommentPopUp = true;
  }

  deleteImgEditComment() {
    this.mainboard.delImgEditComment.nativeElement.src = "";
  }
  //----Change-Comment-Functions----//

  /**
 * Saves changes to a comment in the selected channel.
 * @param {string} id - The ID of the comment to be updated.
 * @param {number} index - The index of the comment in the array.
 */
  async saveCommentChange(id: string, index: number) {
    if (this.mainboard.newChangedMessage.nativeElement.value.length >= 1) {
      let newMessage = this.mainboard.newChangedMessage.nativeElement.value;
      let img = this.mainboard.delImgEditComment.nativeElement.src
      await updateDoc(doc(this.mainboard.channelContentRef(), id), {
        message: newMessage,
        messageImg: img
      })
      this.mainboard.selectedChannelContent[index].editComment = false;
      this.errorMessageCommentChange = false;
    } else {
      this.errorMessageCommentChange = true;
    }
  }

  closeEditComment(index: number) {
    this.mainboard.selectedChannelContent[index].editComment = false;
  }

  //--Reactions-Popup--//
  showPopupForReactions(event: MouseEvent, index: number): void {
    this.mainboard.hoveredEmojiIndex = index;
    this.isPopupForReactionsVisible = true;
  }

  hidePopupForReactions(): void {
    this.mainboard.hoveredEmojiIndex = null;
    this.isPopupForReactionsVisible = false;
  }

  /**
   * Remove the selected emoji, if user has allready selected one.
   */
  async removeEmoji(index: number) {
    debugger
    let { emojiContainer, emojiByContainer, emojiCounterContainer } = this.mainboard.referencesEmoji();
    let id = this.mainboard.selectedChannelContent[this.mainboard.hoveredChannelIndex]['id'];
    if (emojiByContainer.includes(this.mainboard.loggedInUserName)) {
      this.updateremoveEmojiContainers(emojiByContainer, emojiCounterContainer, emojiContainer, index);
    }
    await updateDoc(doc(this.mainboard.channelContentRef(), id), {
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
      if (name == this.mainboard.loggedInUserName) {
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

  //--Thread-Menu--//
  showThread() {
    this.mainboard.toggleThread = true;
    if (this.mainboard.toggleMenu && this.mainboard.toggleThread && window.innerWidth < 1400) {
      this.mainboard.toggleMenu = false;
    }
  }

}
