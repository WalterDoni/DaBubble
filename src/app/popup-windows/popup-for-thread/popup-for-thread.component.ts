import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-for-thread',
  templateUrl: './popup-for-thread.component.html',
  styleUrls: ['./popup-for-thread.component.scss']
})

export class PopupForThreadComponent {
  constructor(private mainboardComponent: MainboardComponent) { }

  openThread() {
    this.mainboardComponent.toggleThread = true;
    if (this.mainboardComponent.toggleMenu && this.mainboardComponent.toggleThread && window.innerWidth < 1400) {
      this.mainboardComponent.toggleMenu = false;
    }
  }

}
