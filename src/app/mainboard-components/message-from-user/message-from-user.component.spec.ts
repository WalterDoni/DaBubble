import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFromUserComponent } from './message-from-user.component';

describe('MessageFromUserComponent', () => {
  let component: MessageFromUserComponent;
  let fixture: ComponentFixture<MessageFromUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageFromUserComponent]
    });
    fixture = TestBed.createComponent(MessageFromUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
