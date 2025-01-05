import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { recordKeys } from 'src/app/shared/models/shared.types';

import { RhBenefitComponentData } from '../../../models/benefit';
import { RhUseResearchPointsArgs } from '../../../models/game-move-args-types';

@Component({
    selector: 'app-rh-logs-use-research-points',
    standalone: false,

    templateUrl: './rh-logs-use-research-points.component.html',
    styleUrl: './rh-logs-use-research-points.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsUseResearchPointsComponent {

    args = input.required<RhUseResearchPointsArgs>();
    name = input.required<string>();

    text = computed(() => {
        const name = this.name();
        return `Выполнил действие "${name}" на ячейке`;
    });

    benefit = computed(() => {
        const cell = this.args().cell;
        return recordKeys(cell.benefit).map(key => {
            const benefit: RhBenefitComponentData = {
                key,
                value: key !== 'tileType'
                    ? cell.benefit[key] ?? 0
                    : 0,
                tileType: key !== 'tileType'
                    ? void 0
                    : cell.benefit[key]?.[0],
                size: 40,
                inlineView: true,
            };
            return benefit;
        })
    });

}
