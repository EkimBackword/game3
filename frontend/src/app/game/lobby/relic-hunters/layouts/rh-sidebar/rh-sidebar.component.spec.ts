import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhSidebarComponent } from './rh-sidebar.component';

describe('RhSidebarComponent', () => {
  let component: RhSidebarComponent;
  let fixture: ComponentFixture<RhSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
