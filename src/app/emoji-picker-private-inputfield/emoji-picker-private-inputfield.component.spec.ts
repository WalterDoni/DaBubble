import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiPickerPrivateInputfieldComponent } from './emoji-picker-private-inputfield.component';

describe('EmojiPickerPrivateInputfieldComponent', () => {
  let component: EmojiPickerPrivateInputfieldComponent;
  let fixture: ComponentFixture<EmojiPickerPrivateInputfieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmojiPickerPrivateInputfieldComponent]
    });
    fixture = TestBed.createComponent(EmojiPickerPrivateInputfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
