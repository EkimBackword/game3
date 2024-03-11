import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeFromAtlantisCellComponent } from './escape-from-atlantis-cell.component';

describe('EscapeFromAtlantisCellComponent', () => {
  let component: EscapeFromAtlantisCellComponent;
  let fixture: ComponentFixture<EscapeFromAtlantisCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscapeFromAtlantisCellComponent]
    });
    fixture = TestBed.createComponent(EscapeFromAtlantisCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
