import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankGameInfoComponent } from './clank-game-info.component';

describe('ClankGameInfoComponent', () => {
  let component: ClankGameInfoComponent;
  let fixture: ComponentFixture<ClankGameInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankGameInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
