import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    HostBinding,
    input,
} from '@angular/core';

import {
    RelicHuntersHeroColorTaxonomy,
    RelicHuntersHeroSettings,
    RhHeroComponentData,
} from '../../models/hero';
import { RelicHuntersTileUtils } from '../../models/tile';

@Component({
    selector: 'app-rh-hero',
    templateUrl: './rh-hero.component.html',
    styleUrls: ['./rh-hero.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhHeroComponent {

    readonly data = input.required<RhHeroComponentData>();

    private positionByIndex = computed(() => {
        const data = this.data();
        const rowCount = 2;
        const leftIndex = data.index % rowCount;
        const topIndex = Math.floor(data.index / rowCount);
        return {
            left: 25 + leftIndex * 250,
            top: 90 + topIndex * 110
        }
    })

    private style = computed<Partial<CSSStyleDeclaration>>(() => {
        const data = this.data();
        const position = this.positionByIndex();

        const leftCell = RelicHuntersTileUtils.getLeft(data.cell);
        const topCell = RelicHuntersTileUtils.getTop(data.cell);
        const colorId = data.player.color;
        const colorInfo = RelicHuntersHeroColorTaxonomy[colorId];
        const heroSize = data.isSelected
            ? RelicHuntersHeroSettings.sizeMeeple * 1.1
            : RelicHuntersHeroSettings.sizeMeeple * 0.9;
        const positionHeroX = colorInfo.column * heroSize;
        const positionHeroY = RelicHuntersHeroSettings.heroIndex * heroSize;
        return {
            left: `${leftCell + position.left}px`,
            top: `${topCell + position.top}px`,
            width: `${heroSize}px`,
            height: `${heroSize}px`,
            backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
            backgroundPosition: `-${positionHeroX}px -${positionHeroY}px`,
            backgroundSize: RelicHuntersHeroSettings.backgroundSize,
            flexShrink: '0',
        };
    });
    @HostBinding('style') cellStyle: Partial<CSSStyleDeclaration> = {};

    constructor(
    ) {
        effect(() => this.cellStyle = this.style());
    }

}
