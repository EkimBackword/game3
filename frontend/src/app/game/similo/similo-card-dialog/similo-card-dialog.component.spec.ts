import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloCardDialogComponent } from './similo-card-dialog.component';

describe('SimiloCardDialogComponent', () => {
  let component: SimiloCardDialogComponent;
  let fixture: ComponentFixture<SimiloCardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloCardDialogComponent]
    });
    fixture = TestBed.createComponent(SimiloCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
