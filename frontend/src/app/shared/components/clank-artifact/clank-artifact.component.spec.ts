import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClankArtifactComponent } from './clank-artifact.component';

describe('ClankArtifactComponent', () => {
  let component: ClankArtifactComponent;
  let fixture: ComponentFixture<ClankArtifactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClankArtifactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClankArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
