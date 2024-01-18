import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInputSearchComponent } from './menu-input-search.component';

describe('MenuInputSearchComponent', () => {
  let component: MenuInputSearchComponent;
  let fixture: ComponentFixture<MenuInputSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuInputSearchComponent]
    });
    fixture = TestBed.createComponent(MenuInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
