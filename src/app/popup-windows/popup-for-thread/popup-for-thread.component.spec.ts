import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupForThreadComponent } from './popup-for-thread.component';

describe('PopupForThreadComponent', () => {
  let component: PopupForThreadComponent;
  let fixture: ComponentFixture<PopupForThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupForThreadComponent]
    });
    fixture = TestBed.createComponent(PopupForThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
