import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhBenefitComponent } from './rh-benefit.component';

describe('RhBenefitComponent', () => {
  let component: RhBenefitComponent;
  let fixture: ComponentFixture<RhBenefitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhBenefitComponent]
    });
    fixture = TestBed.createComponent(RhBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
