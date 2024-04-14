import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhCellComponent } from './rh-cell.component';

describe('RhCellComponent', () => {
  let component: RhCellComponent;
  let fixture: ComponentFixture<RhCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhCellComponent]
    });
    fixture = TestBed.createComponent(RhCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
