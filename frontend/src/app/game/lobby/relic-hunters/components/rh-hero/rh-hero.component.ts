import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { GamePlayerId } from '@shared/game/game-constants';

import { RelicHuntersCellInfo } from '../../models/cell';
import {
    RelicHuntersHeroColorTaxonomy,
    RelicHuntersHeroSettings,
} from '../../models/hero';
import { RelicHuntersPlayer } from '../../models/player';
import { RelicHuntersTileUtils } from '../../models/tile';

@Component({
    selector: 'app-rh-hero',
    templateUrl: './rh-hero.component.html',
    styleUrls: ['./rh-hero.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhHeroComponent implements OnChanges {

    @Input({ required: true }) data!: {
        id: GamePlayerId;
        player: RelicHuntersPlayer;
        cell: RelicHuntersCellInfo;
        index: number;
        isActive: boolean;
        isCurrent: boolean;
    };

    @HostBinding('style') cellStyle: Partial<CSSStyleDeclaration> = {};

    constructor(
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateStyles();
    }

    private updateStyles() {
        this.cellStyle = this.getCellStyle();
    }

    private getCellStyle() {
        const leftCell = RelicHuntersTileUtils.getLeft(this.data.cell);
        const topCell = RelicHuntersTileUtils.getTop(this.data.cell);
        const position = this.getPositionByIndex();
        const colorId = this.data.player.color;
        const colorInfo = RelicHuntersHeroColorTaxonomy[colorId];
        const heroSize = RelicHuntersHeroSettings.sizeMeeple;
        const positionHeroX = colorInfo.column * heroSize;
        const positionHeroY = RelicHuntersHeroSettings.heroIndex * heroSize;
        const result: Partial<CSSStyleDeclaration> = {
            left: `${leftCell + position.left}px`,
            top: `${topCell + position.top}px`,
            width: `${heroSize}px`,
            height: `${heroSize}px`,
            backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
            backgroundPosition: `-${positionHeroX}px -${positionHeroY}px`,
            backgroundSize: RelicHuntersHeroSettings.backgroundSize,
            flexShrink: '0',
        };
        return result;
    }

    private getPositionByIndex() {
        const rowCount = 2;
        const leftIndex = this.data.index % rowCount;
        const topIndex = Math.floor(this.data.index / rowCount);
        return {
            left: 25 + leftIndex * 250,
            top: 90 + topIndex * 110
        }
    }

}
