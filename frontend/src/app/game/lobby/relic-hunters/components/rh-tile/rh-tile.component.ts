import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
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
})
export class RhTileComponent implements OnChanges {

    @Input({ required: true }) tileType!: RelicHuntersTileTypes;
    @Input({ required: true }) isOpen!: boolean;
    @Input() @HostBinding('style.width.px') width = RelicHuntersTileSettings.width;
    @Input() @HostBinding('style.height.px') height = RelicHuntersTileSettings.height;

    tileStyle: Partial < CSSStyleDeclaration > = {};

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        this.tileStyle = this.getTileStyle();
    }

    private getTileStyle() {
        const tileType = RelicHuntersTileTypeTaxonomy[this.tileType];
        const positionX = tileType.column * this.width;
        const rowIndex = this.isOpen
            ? RelicHuntersTileSettings.openRow
            : RelicHuntersTileSettings.closeRow
        const positionY = rowIndex * this.height;
        const result: Partial<CSSStyleDeclaration> = {
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(${RelicHuntersTileSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersTileSettings.backgroundSize,
        };
        return result;
    }
}
