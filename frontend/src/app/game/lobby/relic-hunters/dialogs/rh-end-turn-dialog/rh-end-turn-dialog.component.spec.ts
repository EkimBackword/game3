import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhEndTurnDialogComponent } from './rh-end-turn-dialog.component';

describe('RhEndTurnDialogComponent', () => {
  let component: RhEndTurnDialogComponent;
  let fixture: ComponentFixture<RhEndTurnDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhEndTurnDialogComponent]
    });
    fixture = TestBed.createComponent(RhEndTurnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
