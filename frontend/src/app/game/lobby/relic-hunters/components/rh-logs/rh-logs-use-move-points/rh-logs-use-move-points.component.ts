import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { recordKeys } from 'src/app/shared/models/shared.types';

import { RhBenefitComponentData } from '../../../models/benefit';
import { RelicHuntersGameBuilder } from '../../../models/game-builder';
import { RhUseMovePointsArgs } from '../../../models/game-move-args-types';

@Component({
    selector: 'app-rh-logs-use-move-points',
    standalone: false,

    templateUrl: './rh-logs-use-move-points.component.html',
    styleUrl: './rh-logs-use-move-points.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsUseMovePointsComponent {

    args = input.required<RhUseMovePointsArgs>();

    builder = input.required<RelicHuntersGameBuilder | null>();

    text = computed(() => {
        const builder = this.builder();

        if (builder == null) {
            return '';
        }

        const move = builder.moves.useMovePoints;
        return `Выполнил действие "${move.name}"`;
    });

    benefit = computed(() => {
        const cellTo = this.args().cellTo;

        if (cellTo.isOpen || cellTo.researchCost !== 0) {
            return null;
        }
        return recordKeys(cellTo.benefit).map(key => {
            const benefit: RhBenefitComponentData = {
                key,
                value: key !== 'tileType'
                    ? cellTo.benefit[key] ?? 0
                    : 0,
                tileType: key !== 'tileType'
                    ? void 0
                    : cellTo.benefit[key]?.[0],
                size: 40,
                inlineView: true,
            };
            return benefit;
        })
    });

}
