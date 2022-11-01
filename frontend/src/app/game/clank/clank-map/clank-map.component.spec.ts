import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankMapComponent } from './clank-map.component';

describe('ClankMapComponent', () => {
  let component: ClankMapComponent;
  let fixture: ComponentFixture<ClankMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
