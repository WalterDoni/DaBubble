import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineInputSearchComponent } from './headline-input-search.component';

describe('HeadlineInputSearchComponent', () => {
  let component: HeadlineInputSearchComponent;
  let fixture: ComponentFixture<HeadlineInputSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadlineInputSearchComponent]
    });
    fixture = TestBed.createComponent(HeadlineInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
