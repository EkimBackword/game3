import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { GameLog } from 'src/app/shared/models/game.types';
import { isKeyInRecord } from 'src/app/shared/models/shared.types';

import { RhBenefitComponentData } from '../../../models/benefit';
import { RelicHuntersGameBuilder } from '../../../models/game-builder';
import {
    RhGetPointsByCardArgs,
    RhGetPointsByMoveArgs,
} from '../../../models/game-move-args-types';

@Component({
    selector: 'app-rh-logs-get-points',
    standalone: false,
    templateUrl: './rh-logs-get-points.component.html',
    styleUrl: './rh-logs-get-points.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsGetPointsComponent {

    type = input.required<GameLog['action']['payload']['type']>();
    args = input.required<RhGetPointsByMoveArgs | RhGetPointsByCardArgs>();
    builder = input.required<RelicHuntersGameBuilder | null>();

    text = computed(() => {
        const type = this.type();
        const builder = this.builder();

        if (builder == null || !isKeyInRecord(type, builder.moves)) {
            return '';
        }

        const move = builder.moves[type];
        return `Выполнил действие "${move.name}" и получил:`;
    });

    benefit = computed<RhBenefitComponentData>(() => {
        const args = this.args();
        return {
            key: args.key,
            value: args.value,
            size: 40,
            inlineView: true,
        };
    });

}
