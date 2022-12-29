import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashCardsComponent } from './trash-cards.component';

describe('TrashCardsComponent', () => {
  let component: TrashCardsComponent;
  let fixture: ComponentFixture<TrashCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
