import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsGetTileComponent } from './rh-logs-get-tile.component';

describe('RhLogsGetTileComponent', () => {
  let component: RhLogsGetTileComponent;
  let fixture: ComponentFixture<RhLogsGetTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsGetTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsGetTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
