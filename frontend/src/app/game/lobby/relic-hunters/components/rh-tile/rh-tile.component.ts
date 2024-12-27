import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    HostBinding,
    input,
} from '@angular/core';

import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypes,
    RelicHuntersTileTypeTaxonomy,
} from '../../models/tile';

@Component({
    selector: 'app-rh-tile',
    templateUrl: './rh-tile.component.html',
    styleUrls: ['./rh-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhTileComponent {

    readonly tileType = input.required<RelicHuntersTileTypes>();
    readonly isOpen = input.required<boolean>();
    readonly width = input(RelicHuntersTileSettings.width);
    readonly height = input(RelicHuntersTileSettings.height);

    @HostBinding('style.width.px')
    widthPx = RelicHuntersTileSettings.width;
    @HostBinding('style.height.px')
    heightPx = RelicHuntersTileSettings.height;

    tileStyle = computed<Partial<CSSStyleDeclaration>>(() => {
        const tileType = RelicHuntersTileTypeTaxonomy[this.tileType()];
        const width = this.width();
        const height = this.height();
        const isOpen = this.isOpen();

        const positionX = tileType.column * width;
        const rowIndex = isOpen
            ? RelicHuntersTileSettings.openRow
            : RelicHuntersTileSettings.closeRow
        const positionY = rowIndex * height;
        return {
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${RelicHuntersTileSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersTileSettings.backgroundSize,
        };
    });

    constructor() {
        effect(() => { this.widthPx = this.width(); })
        effect(() => { this.heightPx = this.height();})
    }

}
