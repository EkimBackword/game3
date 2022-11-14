import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankMeepleComponent } from './clank-meeple.component';

describe('ClankMeepleComponent', () => {
  let component: ClankMeepleComponent;
  let fixture: ComponentFixture<ClankMeepleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankMeepleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankMeepleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
