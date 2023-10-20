import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimiloTableInfoComponent } from './similo-table-info.component';

describe('SimiloTableInfoComponent', () => {
  let component: SimiloTableInfoComponent;
  let fixture: ComponentFixture<SimiloTableInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimiloTableInfoComponent]
    });
    fixture = TestBed.createComponent(SimiloTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
