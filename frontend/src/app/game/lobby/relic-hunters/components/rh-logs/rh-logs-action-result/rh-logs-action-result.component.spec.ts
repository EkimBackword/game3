import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsActionResultComponent } from './rh-logs-action-result.component';

describe('RhLogsActionResultComponent', () => {
  let component: RhLogsActionResultComponent;
  let fixture: ComponentFixture<RhLogsActionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhLogsActionResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsActionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
