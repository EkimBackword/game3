import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import {
    RelicHuntersRelicSettings,
    RelicHuntersRelicTypeEnum,
    RelicHuntersRelicTypeTaxonomy,
} from '../../models/relic';

@Component({
    selector: 'app-rh-relic',
    templateUrl: './rh-relic.component.html',
    styleUrls: ['./rh-relic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhRelicComponent {

    readonly relicType = input.required<RelicHuntersRelicTypeEnum>();
    readonly size = input(RelicHuntersRelicSettings.size);

    relicInfo = computed(() => {
        return RelicHuntersRelicTypeTaxonomy[this.relicType()];
    });

    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const relicInfo = this.relicInfo();
        const size = this.size();
        const positionX = relicInfo.column * size;
        const rowIndex = 0;
        const positionY = rowIndex * size;
        return {
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${RelicHuntersRelicSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersRelicSettings.backgroundSize,
        };
    });

    constructor(
    ) {
    }

}
