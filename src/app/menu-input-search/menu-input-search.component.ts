import { Component } from '@angular/core';
import { MainboardComponent } from '../mainboard/mainboard.component';

@Component({
  selector: 'app-menu-input-search',
  templateUrl: './menu-input-search.component.html',
  styleUrls: ['./menu-input-search.component.scss']
})
export class MenuInputSearchComponent {
    
  searchTermMenu!: string;
  filteredUserArrayMenu: any[] = [];
  filteredChannelsArrayMenu: any[] = [];

  constructor(public mainboard: MainboardComponent){
  }

  
  /**
 * Adds members to a channel based on the provided search term.
 * Filters user array for members based on the search term, updating the filtered members array.
 */
  addMemberToChannelSearch() {
    if (this.mainboard.searchTermChannelMember && this.mainboard.searchTermChannelMember.length >= 1) {
      this.mainboard.filteredMemberArray = this.mainboard.userArray.filter(user =>
        user.username.toLowerCase().includes(this.mainboard.searchTermChannelMember.toLowerCase())
      )
    } else {
      this.mainboard.filteredMemberArray = [];
    }
  }

  /**
 * Searches for users and channels in the chat menu based on the provided search term.
 * Filters user and channel arrays in the chat menu based on the search term, updating the corresponding filtered arrays.
 */
  searchfieldAtChat() {
    if (this.searchTermMenu && this.searchTermMenu.length >= 1) {
      this.filteredUserArrayMenu = this.mainboard.userArray.filter(user =>
        user.username.toLowerCase().includes(this.searchTermMenu.toLocaleLowerCase())
      );
      this.filteredChannelsArrayMenu = this.mainboard.channelsArray.filter(user =>
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

}
