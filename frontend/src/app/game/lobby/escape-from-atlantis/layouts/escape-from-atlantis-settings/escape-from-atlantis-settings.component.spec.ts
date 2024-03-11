import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { EscapeFromAtlantisSettingsComponent } from './escape-from-atlantis-settings.component';

describe('EscapeFromAtlantisSettingsComponent', () => {
    let component: EscapeFromAtlantisSettingsComponent;
    let fixture: ComponentFixture < EscapeFromAtlantisSettingsComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EscapeFromAtlantisSettingsComponent]
        });
        fixture = TestBed.createComponent(EscapeFromAtlantisSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
