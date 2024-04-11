import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhHeroComponent } from './rh-hero.component';

describe('RhHeroComponent', () => {
  let component: RhHeroComponent;
  let fixture: ComponentFixture<RhHeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhHeroComponent]
    });
    fixture = TestBed.createComponent(RhHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
