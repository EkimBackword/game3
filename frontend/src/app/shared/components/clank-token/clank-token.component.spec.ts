import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankTokenComponent } from './clank-token.component';

describe('ClankTokenComponent', () => {
  let component: ClankTokenComponent;
  let fixture: ComponentFixture<ClankTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
