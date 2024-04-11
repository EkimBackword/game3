import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhCardComponent } from './rh-card.component';

describe('RhCardComponent', () => {
  let component: RhCardComponent;
  let fixture: ComponentFixture<RhCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhCardComponent]
    });
    fixture = TestBed.createComponent(RhCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
