import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRowDetailComponent } from './player-row-detail.component';

describe('PlayerRowDetailComponent', () => {
  let component: PlayerRowDetailComponent;
  let fixture: ComponentFixture<PlayerRowDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerRowDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerRowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
