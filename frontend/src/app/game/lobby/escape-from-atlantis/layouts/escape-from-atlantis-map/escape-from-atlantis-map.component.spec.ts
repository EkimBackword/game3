import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { EscapeFromAtlantisMapComponent } from './escape-from-atlantis-map.component';

describe('EscapeFromAtlantisMapComponent', () => {
    let component: EscapeFromAtlantisMapComponent;
    let fixture: ComponentFixture < EscapeFromAtlantisMapComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EscapeFromAtlantisMapComponent]
        });
        fixture = TestBed.createComponent(EscapeFromAtlantisMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
