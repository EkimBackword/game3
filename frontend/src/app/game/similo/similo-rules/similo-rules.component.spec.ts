import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloRulesComponent } from './similo-rules.component';

describe('SimiloRulesComponent', () => {
  let component: SimiloRulesComponent;
  let fixture: ComponentFixture<SimiloRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloRulesComponent]
    });
    fixture = TestBed.createComponent(SimiloRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
