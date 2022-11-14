import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { ClankCostInfoComponent } from './clank-cost-info.component';

describe('ClankCostInfoComponent', () => {
  let component: ClankCostInfoComponent;
  let fixture: ComponentFixture<ClankCostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankCostInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankCostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
