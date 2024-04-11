import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhSettingsComponent } from './rh-settings.component';

describe('RhSettingsComponent', () => {
  let component: RhSettingsComponent;
  let fixture: ComponentFixture<RhSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhSettingsComponent]
    });
    fixture = TestBed.createComponent(RhSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
