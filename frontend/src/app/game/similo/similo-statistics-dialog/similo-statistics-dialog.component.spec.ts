import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloStatisticsDialogComponent } from './similo-statistics-dialog.component';

describe('SimiloStatisticsDialogComponent', () => {
  let component: SimiloStatisticsDialogComponent;
  let fixture: ComponentFixture<SimiloStatisticsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloStatisticsDialogComponent]
    });
    fixture = TestBed.createComponent(SimiloStatisticsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
