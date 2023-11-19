import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNewPasswordComponent } from './email-new-password.component';

describe('EmailNewPasswordComponent', () => {
  let component: EmailNewPasswordComponent;
  let fixture: ComponentFixture<EmailNewPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailNewPasswordComponent]
    });
    fixture = TestBed.createComponent(EmailNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
