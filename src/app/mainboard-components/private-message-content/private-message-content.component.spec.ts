import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMessageContentComponent } from './private-message-content.component';

describe('PrivateMessageContentComponent', () => {
  let component: PrivateMessageContentComponent;
  let fixture: ComponentFixture<PrivateMessageContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateMessageContentComponent]
    });
    fixture = TestBed.createComponent(PrivateMessageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
