import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembersMainboardHeadlineComponent } from './add-members-mainboard-headline.component';

describe('AddMembersMainboardHeadlineComponent', () => {
  let component: AddMembersMainboardHeadlineComponent;
  let fixture: ComponentFixture<AddMembersMainboardHeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMembersMainboardHeadlineComponent]
    });
    fixture = TestBed.createComponent(AddMembersMainboardHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
