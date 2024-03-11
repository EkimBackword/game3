import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { EscapeFromAtlantisComponent } from './escape-from-atlantis.component';

describe('EscapeFromAtlantisComponent', () => {
    let component: EscapeFromAtlantisComponent;
    let fixture: ComponentFixture < EscapeFromAtlantisComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EscapeFromAtlantisComponent]
        });
        fixture = TestBed.createComponent(EscapeFromAtlantisComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
