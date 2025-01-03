import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsUseResearchPointsComponent } from './rh-logs-use-research-points.component';

describe('RhLogsUseResearchPointsComponent', () => {
  let component: RhLogsUseResearchPointsComponent;
  let fixture: ComponentFixture<RhLogsUseResearchPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsUseResearchPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsUseResearchPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
