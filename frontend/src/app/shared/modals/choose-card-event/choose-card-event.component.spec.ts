import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCardEventComponent } from './choose-card-event.component';

describe('ChooseCardEventComponent', () => {
  let component: ChooseCardEventComponent;
  let fixture: ComponentFixture<ChooseCardEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseCardEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCardEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
