import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhLogsCellComponent } from './rh-logs-cell.component';

describe('RhLogsCellComponent', () => {
  let component: RhLogsCellComponent;
  let fixture: ComponentFixture<RhLogsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhLogsCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhLogsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
