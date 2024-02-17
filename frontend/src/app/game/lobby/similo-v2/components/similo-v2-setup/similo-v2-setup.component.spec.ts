import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { SimiloV2SetupComponent } from './similo-v2-setup.component';

describe('SimiloV2SetupComponent', () => {
    let component: SimiloV2SetupComponent;
    let fixture: ComponentFixture < SimiloV2SetupComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SimiloV2SetupComponent]
        });
        fixture = TestBed.createComponent(SimiloV2SetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
