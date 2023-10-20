import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloCardComponent } from './similo-card.component';

describe('SimiloCardComponent', () => {
  let component: SimiloCardComponent;
  let fixture: ComponentFixture<SimiloCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloCardComponent]
    });
    fixture = TestBed.createComponent(SimiloCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
