import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { ClankCardComponent } from './clank-card.component';

describe('ClankCardComponent', () => {
  let component: ClankCardComponent;
  let fixture: ComponentFixture<ClankCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
