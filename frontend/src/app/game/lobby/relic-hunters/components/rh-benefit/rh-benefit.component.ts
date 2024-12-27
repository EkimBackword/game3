import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    HostBinding,
    input,
} from '@angular/core';

import {
    RelicHuntersBenefitSettings,
    RelicHuntersBenefitTaxonomy,
    RhBenefitComponentData,
} from '../../models/benefit';
import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypeTaxonomy,
} from '../../models/tile';

@Component({
    selector: 'app-rh-benefit',
    templateUrl: './rh-benefit.component.html',
    styleUrls: ['./rh-benefit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhBenefitComponent {

    readonly data = input.required<RhBenefitComponentData>();
    private size = computed(() => this.data().size ?? RelicHuntersBenefitSettings.size);
    @HostBinding('style.--benefit-size.px') sizePx = 0;

    readonly style = computed(() => {
        const data = this.data();
        const size = this.size();
        if (data.tileType != null) {
            const tileType = RelicHuntersTileTypeTaxonomy[data.tileType];
            const positionX = tileType.column * data.size;
            const rowIndex = RelicHuntersTileSettings.openRow;
            const positionY = rowIndex * data.size;
            const result: Partial<CSSStyleDeclaration> = {
                width: `${data.size}px`,
                height: `${data.size}px`,
                backgroundImage: `url(${RelicHuntersTileSettings.url})`,
                backgroundPosition: `-${positionX}px -${positionY}px`,
                backgroundSize: RelicHuntersTileSettings.backgroundSize,
            };
            return result;
        }

        const benefitInfo = RelicHuntersBenefitTaxonomy[data.key];
        if (benefitInfo?.column == null) {
            return {};
        }
        const positionX = benefitInfo.column * size;
        const rowIndex = data.inlineView ? 0 : 1;
        const positionY = rowIndex * size;
        const result: Partial<CSSStyleDeclaration> = {
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${RelicHuntersBenefitSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersBenefitSettings.backgroundSize,
        };
        return result;
    });

    constructor(
    ) {
        effect(() => { this.sizePx = this.size(); });
    }

}
