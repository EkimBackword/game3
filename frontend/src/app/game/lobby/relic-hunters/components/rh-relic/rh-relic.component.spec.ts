import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhRelicComponent } from './rh-relic.component';

describe('RhRelicComponent', () => {
  let component: RhRelicComponent;
  let fixture: ComponentFixture<RhRelicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhRelicComponent]
    });
    fixture = TestBed.createComponent(RhRelicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
