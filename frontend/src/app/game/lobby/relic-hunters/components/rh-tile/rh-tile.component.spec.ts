import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhTileComponent } from './rh-tile.component';

describe('RhTileComponent', () => {
  let component: RhTileComponent;
  let fixture: ComponentFixture<RhTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhTileComponent]
    });
    fixture = TestBed.createComponent(RhTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
