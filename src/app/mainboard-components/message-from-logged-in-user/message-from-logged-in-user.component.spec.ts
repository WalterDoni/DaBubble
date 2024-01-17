import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFromLoggedInUserComponent } from './message-from-logged-in-user.component';

describe('MessageFromLoggedInUserComponent', () => {
  let component: MessageFromLoggedInUserComponent;
  let fixture: ComponentFixture<MessageFromLoggedInUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageFromLoggedInUserComponent]
    });
    fixture = TestBed.createComponent(MessageFromLoggedInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
