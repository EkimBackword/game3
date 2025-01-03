import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { RhBenefitComponentData } from '../../../models/benefit';
import { RelicHuntersGameBuilder } from '../../../models/game-builder';
import { RhGetTileTypeArgs } from '../../../models/game-move-args-types';

@Component({
    selector: 'app-rh-logs-get-tile',
    standalone: false,

    templateUrl: './rh-logs-get-tile.component.html',
    styleUrl: './rh-logs-get-tile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsGetTileComponent {

    args = input.required<RhGetTileTypeArgs>();
    builder = input.required<RelicHuntersGameBuilder | null>();

    text = computed(() => {
        const builder = this.builder();

        if (builder == null) {
            return '';
        }

        const move = builder.moves.getTileType;
        return `Выполнил действие "${move.name}" и получил:`;
    });

    benefit = computed<RhBenefitComponentData>(() => {
        const args = this.args();
        return {
            key: 'tileType',
            value: 0,
            tileType: args.tileTypes?.[0],
            size: 40,
            inlineView: true,
        };
    });

}
