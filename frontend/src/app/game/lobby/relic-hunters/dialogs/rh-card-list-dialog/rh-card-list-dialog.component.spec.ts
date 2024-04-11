import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhCardListDialogComponent } from './rh-card-list-dialog.component';

describe('RhCardListDialogComponent', () => {
  let component: RhCardListDialogComponent;
  let fixture: ComponentFixture<RhCardListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhCardListDialogComponent]
    });
    fixture = TestBed.createComponent(RhCardListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
