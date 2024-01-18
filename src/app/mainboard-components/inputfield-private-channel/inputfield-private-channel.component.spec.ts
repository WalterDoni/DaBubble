import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputfieldPrivateChannelComponent } from './inputfield-private-channel.component';

describe('InputfieldPrivateChannelComponent', () => {
  let component: InputfieldPrivateChannelComponent;
  let fixture: ComponentFixture<InputfieldPrivateChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputfieldPrivateChannelComponent]
    });
    fixture = TestBed.createComponent(InputfieldPrivateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
