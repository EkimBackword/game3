import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsComponent } from './rh-logs.component';

describe('RhLogsComponent', () => {
  let component: RhLogsComponent;
  let fixture: ComponentFixture<RhLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
