import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputfieldNormailChatComponent } from './inputfield-normail-chat.component';

describe('InputfieldNormailChatComponent', () => {
  let component: InputfieldNormailChatComponent;
  let fixture: ComponentFixture<InputfieldNormailChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputfieldNormailChatComponent]
    });
    fixture = TestBed.createComponent(InputfieldNormailChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
