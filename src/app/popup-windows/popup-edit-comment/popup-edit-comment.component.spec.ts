import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditCommentComponent } from './popup-edit-comment.component';

describe('PopupEditCommentComponent', () => {
  let component: PopupEditCommentComponent;
  let fixture: ComponentFixture<PopupEditCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupEditCommentComponent]
    });
    fixture = TestBed.createComponent(PopupEditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
