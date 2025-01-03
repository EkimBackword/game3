import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsCardComponent } from './rh-logs-card.component';

describe('RhLogsCardComponent', () => {
  let component: RhLogsCardComponent;
  let fixture: ComponentFixture<RhLogsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
