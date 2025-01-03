import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsGetPointsComponent } from './rh-logs-get-points.component';

describe('RhLogsGetPointsComponent', () => {
  let component: RhLogsGetPointsComponent;
  let fixture: ComponentFixture<RhLogsGetPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsGetPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsGetPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
