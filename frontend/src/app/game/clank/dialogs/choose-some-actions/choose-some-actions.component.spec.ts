import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSomeActionsComponent } from './choose-some-actions.component';

describe('ChooseSomeActionsComponent', () => {
  let component: ChooseSomeActionsComponent;
  let fixture: ComponentFixture<ChooseSomeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseSomeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSomeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
