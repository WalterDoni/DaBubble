import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersMainboardHeadlineComponent } from './members-mainboard-headline.component';

describe('MembersMainboardHeadlineComponent', () => {
  let component: MembersMainboardHeadlineComponent;
  let fixture: ComponentFixture<MembersMainboardHeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersMainboardHeadlineComponent]
    });
    fixture = TestBed.createComponent(MembersMainboardHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
