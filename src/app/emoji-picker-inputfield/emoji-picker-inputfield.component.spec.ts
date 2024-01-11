import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiPickerInputfieldComponent } from './emoji-picker-inputfield.component';

describe('EmojiPickerInputfieldComponent', () => {
  let component: EmojiPickerInputfieldComponent;
  let fixture: ComponentFixture<EmojiPickerInputfieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmojiPickerInputfieldComponent]
    });
    fixture = TestBed.createComponent(EmojiPickerInputfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
