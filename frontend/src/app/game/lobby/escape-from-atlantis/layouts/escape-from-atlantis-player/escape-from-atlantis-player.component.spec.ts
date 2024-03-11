import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { EscapeFromAtlantisPlayerComponent } from './escape-from-atlantis-player.component';

describe('EscapeFromAtlantisPlayerComponent', () => {
    let component: EscapeFromAtlantisPlayerComponent;
    let fixture: ComponentFixture < EscapeFromAtlantisPlayerComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EscapeFromAtlantisPlayerComponent]
        });
        fixture = TestBed.createComponent(EscapeFromAtlantisPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
