import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { SimiloV2Component } from './similo-v2.component';

describe('SimiloV2Component', () => {
    let component: SimiloV2Component;
    let fixture: ComponentFixture < SimiloV2Component > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SimiloV2Component]
        });
        fixture = TestBed.createComponent(SimiloV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
