import { Component } from '@angular/core';
import { MainboardComponent } from 'src/app/mainboard/mainboard.component';

@Component({
  selector: 'app-popup-edit-comment',
  templateUrl: './popup-edit-comment.component.html',
  styleUrls: ['./popup-edit-comment.component.scss']
})
export class PopupEditCommentComponent {
  index!: number;

  constructor(public mainboard: MainboardComponent){}

  changeComment(index: number){
    this.mainboard.selectedChannelContent.forEach((channel, i) => {
      channel.editComment = i === index;
    });
  }

}
