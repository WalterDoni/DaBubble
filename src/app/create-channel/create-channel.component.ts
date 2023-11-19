import { Component } from '@angular/core';
import { MenuComponent } from '../mainboard-components/menu/menu.component';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {

  constructor(private menu: MenuComponent) {

  }

  closeWindow() {
    this.menu.toggleCreateChannel = false;
  }

  stopClosing(event: Event) {
    event.stopPropagation();
  }
}
