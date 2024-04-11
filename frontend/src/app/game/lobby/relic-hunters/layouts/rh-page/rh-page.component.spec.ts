import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhPageComponent } from './rh-page.component';

describe('RhPageComponent', () => {
  let component: RhPageComponent;
  let fixture: ComponentFixture<RhPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhPageComponent]
    });
    fixture = TestBed.createComponent(RhPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
