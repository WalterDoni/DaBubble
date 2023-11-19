import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupReactionsComponent } from './popup-reactions.component';

describe('PopupReactionsComponent', () => {
  let component: PopupReactionsComponent;
  let fixture: ComponentFixture<PopupReactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupReactionsComponent]
    });
    fixture = TestBed.createComponent(PopupReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
