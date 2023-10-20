import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloComponent } from './similo.component';

describe('SimiloComponent', () => {
  let component: SimiloComponent;
  let fixture: ComponentFixture<SimiloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloComponent]
    });
    fixture = TestBed.createComponent(SimiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
