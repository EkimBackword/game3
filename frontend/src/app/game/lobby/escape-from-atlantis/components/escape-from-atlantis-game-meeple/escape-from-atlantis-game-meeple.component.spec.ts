import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeFromAtlantisGameMeepleComponent } from './escape-from-atlantis-game-meeple.component';

describe('EscapeFromAtlantisGameMeepleComponent', () => {
  let component: EscapeFromAtlantisGameMeepleComponent;
  let fixture: ComponentFixture<EscapeFromAtlantisGameMeepleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscapeFromAtlantisGameMeepleComponent]
    });
    fixture = TestBed.createComponent(EscapeFromAtlantisGameMeepleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
