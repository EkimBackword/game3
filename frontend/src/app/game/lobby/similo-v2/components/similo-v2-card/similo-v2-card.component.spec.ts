import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { SimiloV2CardComponent } from './similo-v2-card.component';

describe('SimiloV2CardComponent', () => {
    let component: SimiloV2CardComponent;
    let fixture: ComponentFixture<SimiloV2CardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SimiloV2CardComponent]
        });
        fixture = TestBed.createComponent(SimiloV2CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
