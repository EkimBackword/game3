import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseSwordsOrHealthComponent } from './use-swords-or-health.component';

describe('UseSwordsOrHealthComponent', () => {
  let component: UseSwordsOrHealthComponent;
  let fixture: ComponentFixture<UseSwordsOrHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseSwordsOrHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseSwordsOrHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
