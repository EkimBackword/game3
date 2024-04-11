import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhWinnerDialogComponent } from './rh-winner-dialog.component';

describe('RhWinnerDialogComponent', () => {
  let component: RhWinnerDialogComponent;
  let fixture: ComponentFixture<RhWinnerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhWinnerDialogComponent]
    });
    fixture = TestBed.createComponent(RhWinnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
