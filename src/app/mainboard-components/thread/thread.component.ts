import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {

  constructor( private mainboard: MainboardComponent){

  }

  closeThread(){
    this.mainboard.toggleThread = false;
  }
}
