import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeFromAtlantisPlayerMeepleComponent } from './escape-from-atlantis-player-meeple.component';

describe('EscapeFromAtlantisPlayerMeepleComponent', () => {
  let component: EscapeFromAtlantisPlayerMeepleComponent;
  let fixture: ComponentFixture<EscapeFromAtlantisPlayerMeepleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscapeFromAtlantisPlayerMeepleComponent]
    });
    fixture = TestBed.createComponent(EscapeFromAtlantisPlayerMeepleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
