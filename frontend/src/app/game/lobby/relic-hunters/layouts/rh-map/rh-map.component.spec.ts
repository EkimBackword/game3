import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhMapComponent } from './rh-map.component';

describe('RhMapComponent', () => {
  let component: RhMapComponent;
  let fixture: ComponentFixture<RhMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhMapComponent]
    });
    fixture = TestBed.createComponent(RhMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
