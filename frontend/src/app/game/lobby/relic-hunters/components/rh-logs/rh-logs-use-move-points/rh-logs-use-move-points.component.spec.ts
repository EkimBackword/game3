import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsUseMovePointsComponent } from './rh-logs-use-move-points.component';

describe('RhLogsUseMovePointsComponent', () => {
  let component: RhLogsUseMovePointsComponent;
  let fixture: ComponentFixture<RhLogsUseMovePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsUseMovePointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsUseMovePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
