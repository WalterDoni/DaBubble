import { Component, ElementRef, ViewChild } from '@angular/core';
import { CreateChannelComponent } from 'src/app/create-channel/create-channel.component';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  toggleCreateChannel: boolean = false;

  openCreateChannelPopUp(){
     this.toggleCreateChannel = true;
  }



}
