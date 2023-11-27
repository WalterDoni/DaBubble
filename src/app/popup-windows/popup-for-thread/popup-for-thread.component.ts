import { Component } from '@angular/core';
import { Index } from '@angular/fire/firestore';
import { ThreadComponent } from 'src/app/mainboard-components/thread/thread.component';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-for-thread',
  templateUrl: './popup-for-thread.component.html',
  styleUrls: ['./popup-for-thread.component.scss']
})

export class PopupForThreadComponent {
  constructor(public mainboard: MainboardComponent) { }

  openThread(index: number) {
    this.mainboard.toggleThread = true;
    if (this.mainboard.toggleMenu && this.mainboard.toggleThread && window.innerWidth < 1400) {
      this.mainboard.toggleMenu = false;
    }
  }

}
