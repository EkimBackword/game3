import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import {
    RelicHuntersBenefit,
    RelicHuntersBenefitSettings,
    RelicHuntersBenefitTaxonomy,
} from '../../models/benefit';
import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypes,
    RelicHuntersTileTypeTaxonomy,
} from '../../models/tile';

@Component({
    selector: 'app-rh-benefit',
    templateUrl: './rh-benefit.component.html',
    styleUrls: ['./rh-benefit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhBenefitComponent implements OnChanges {

    @Input({ required: true }) data!: {
        key: keyof RelicHuntersBenefit;
        tileType?: RelicHuntersTileTypes;
        value: number;
        size: number;
        inlineView: boolean;
    };

    @HostBinding('style.--benefit-size.px') size = 0;

    style: Partial<CSSStyleDeclaration> = {};

    constructor(
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.size = this.data.size ?? RelicHuntersBenefitSettings.size;
        this.style = this.getBenefitStyle();
    }

    private getBenefitStyle() {
        if (this.data.tileType != null) {
            const tileType = RelicHuntersTileTypeTaxonomy[this.data.tileType];
            const positionX = tileType.column * this.data.size;
            const rowIndex = RelicHuntersTileSettings.openRow;
            const positionY = rowIndex * this.data.size;
            const result: Partial<CSSStyleDeclaration> = {
                width: `${this.data.size}px`,
                height: `${this.data.size}px`,
                backgroundImage: `url(${RelicHuntersTileSettings.url})`,
                backgroundPosition: `-${positionX}px -${positionY}px`,
                backgroundSize: RelicHuntersTileSettings.backgroundSize,
            };
            return result;
        }

        const benefitInfo = RelicHuntersBenefitTaxonomy[this.data.key];
        if (benefitInfo?.column == null) {
            return {};
        }
        const positionX = benefitInfo.column * this.size;
        const rowIndex = this.data.inlineView ? 0 : 1;
        const positionY = rowIndex * this.size;
        const result: Partial<CSSStyleDeclaration> = {
            width: `${this.size}px`,
            height: `${this.size}px`,
            backgroundImage: `url(${RelicHuntersBenefitSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersBenefitSettings.backgroundSize,
        };
        return result;
    }

}
