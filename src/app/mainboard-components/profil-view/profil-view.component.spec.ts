import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilViewComponent } from './profil-view.component';

describe('ProfilViewComponent', () => {
  let component: ProfilViewComponent;
  let fixture: ComponentFixture<ProfilViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilViewComponent]
    });
    fixture = TestBed.createComponent(ProfilViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
