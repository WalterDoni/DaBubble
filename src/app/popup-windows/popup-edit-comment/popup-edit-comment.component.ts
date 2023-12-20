import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-edit-comment',
  templateUrl: './popup-edit-comment.component.html',
  styleUrls: ['./popup-edit-comment.component.scss']
})
export class PopupEditCommentComponent {
  constructor(public mainboard: MainboardComponent){}

  changeComment(){
    this.mainboard.editComment = true;
  }

}
