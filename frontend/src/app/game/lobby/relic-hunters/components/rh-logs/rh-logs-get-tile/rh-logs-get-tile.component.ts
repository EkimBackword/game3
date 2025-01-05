import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { RhBenefitComponentData } from '../../../models/benefit';
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
    name = input.required<string>();

    text = computed(() => {
        const name = this.name();
        return `Выполнил действие "${name}" и получил:`;
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
