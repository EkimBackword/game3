import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankMapElementComponent } from './clank-map-element.component';

describe('ClankMapElementComponent', () => {
  let component: ClankMapElementComponent;
  let fixture: ComponentFixture<ClankMapElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankMapElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankMapElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
