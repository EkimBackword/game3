import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonInfoLogComponent } from './dragon-info-log.component';

describe('DragonInfoLogComponent', () => {
  let component: DragonInfoLogComponent;
  let fixture: ComponentFixture<DragonInfoLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragonInfoLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonInfoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
