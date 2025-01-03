import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundSettingsByTypeComponent } from './sound-settings-by-type.component';

describe('SoundSettingsByTypeComponent', () => {
  let component: SoundSettingsByTypeComponent;
  let fixture: ComponentFixture<SoundSettingsByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundSettingsByTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundSettingsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
