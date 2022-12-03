import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankDungeonRowComponent } from './clank-dungeon-row.component';

describe('ClankDungeonRowComponent', () => {
  let component: ClankDungeonRowComponent;
  let fixture: ComponentFixture<ClankDungeonRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankDungeonRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankDungeonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
