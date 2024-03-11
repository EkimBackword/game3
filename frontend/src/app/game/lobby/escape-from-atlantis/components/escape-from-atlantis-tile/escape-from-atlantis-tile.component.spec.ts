import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeFromAtlantisTileComponent } from './escape-from-atlantis-tile.component';

describe('EscapeFromAtlantisTileComponent', () => {
  let component: EscapeFromAtlantisTileComponent;
  let fixture: ComponentFixture<EscapeFromAtlantisTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscapeFromAtlantisTileComponent]
    });
    fixture = TestBed.createComponent(EscapeFromAtlantisTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
