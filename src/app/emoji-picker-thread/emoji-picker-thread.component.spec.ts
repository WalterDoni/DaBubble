import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiPickerThreadComponent } from './emoji-picker-thread.component';

describe('EmojiPickerThreadComponent', () => {
  let component: EmojiPickerThreadComponent;
  let fixture: ComponentFixture<EmojiPickerThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmojiPickerThreadComponent]
    });
    fixture = TestBed.createComponent(EmojiPickerThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
