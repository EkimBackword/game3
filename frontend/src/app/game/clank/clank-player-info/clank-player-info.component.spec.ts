import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankPlayerInfoComponent } from './clank-player-info.component';

describe('ClankPlayerInfoComponent', () => {
  let component: ClankPlayerInfoComponent;
  let fixture: ComponentFixture<ClankPlayerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankPlayerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
