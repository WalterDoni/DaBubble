import { Component } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';

@Component({
  selector: 'app-headline-input-search',
  templateUrl: './headline-input-search.component.html',
  styleUrls: ['./headline-input-search.component.scss']
})
export class HeadlineInputSearchComponent {
  searchTerm!: string;
  filteredUserArray: any[] = [];
  filteredChannelsArray: any[] = [];

  constructor(public mainboard: MainboardComponent) {

  }

  /**
* Searches for users and channels based on the provided search term.
* Filters user and channel arrays based on the search term, updating the corresponding filtered arrays.
*/
  search() {
    if (this.searchTerm && this.searchTerm.length >= 1) {
      this.filteredUserArray = this.mainboard.userArray.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredChannelsArray = this.mainboard.channelsArray.filter(user =>
        user.channelName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUserArray = [];
      this.filteredChannelsArray = [];
    }
  }

  /**
* Selects a user for direct messages based on the provided username.
* @param {string} username - The username of the selected user.
*/
  selectUserSearchfield(username: string) {
    this.mainboard.directMessageContent = true;
    this.mainboard.menuSearchfieldChat = false;
    this.mainboard.chatContent = false;
    for (let i = 0; i < this.mainboard.userArray.length; i++) {
      if (this.mainboard.userArray[i]['username'] == username) {
        this.mainboard.selectedUserDirectMessageImage = this.mainboard.userArray[i].img;
        this.mainboard.selectedUserDirectMessageName = this.mainboard.userArray[i].username;
      }
    }
  }

  /**
 * Selects a channel in the chat based on the provided channel name.
 */
  selectChannelSearchfield(channelName: string) {
    this.mainboard.chatContent = true;
    this.mainboard.directMessageContent = false;
    this.mainboard.menuSearchfieldChat = false;
    for (let i = 0; i < this.mainboard.channelsArray.length; i++) {
      if (this.mainboard.channelsArray[i]['channelName'] == channelName) {
        this.mainboard.selectedChannelTitle = this.mainboard.channelsArray[i].channelName;
        this.mainboard.selectedChannelDescription = this.mainboard.channelsArray[i].channelDescription;
        this.mainboard.selectedChannelCreated = this.mainboard.channelsArray[i].channelCreated;
        this.mainboard.channelID = this.mainboard.channelsArray[i].channelId;
        this.mainboard.channelContent();
      }
    }
  }


}
