import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankComponent } from './clank.component';

describe('ClankComponent', () => {
  let component: ClankComponent;
  let fixture: ComponentFixture<ClankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
