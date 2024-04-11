import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhPlayersComponent } from './rh-players.component';

describe('RhPlayersComponent', () => {
  let component: RhPlayersComponent;
  let fixture: ComponentFixture<RhPlayersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhPlayersComponent]
    });
    fixture = TestBed.createComponent(RhPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
