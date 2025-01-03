import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsEndTurnComponent } from './rh-logs-end-turn.component';

describe('RhLogsEndTurnComponent', () => {
  let component: RhLogsEndTurnComponent;
  let fixture: ComponentFixture<RhLogsEndTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsEndTurnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsEndTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
