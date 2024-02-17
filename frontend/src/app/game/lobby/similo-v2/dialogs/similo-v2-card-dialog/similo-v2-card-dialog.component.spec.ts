import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { SimiloV2CardDialogComponent } from './similo-v2-card-dialog.component';

describe('SimiloV2CardDialogComponent', () => {
    let component: SimiloV2CardDialogComponent<any>;
    let fixture: ComponentFixture<SimiloV2CardDialogComponent<any>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SimiloV2CardDialogComponent]
        });
        fixture = TestBed.createComponent(SimiloV2CardDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
