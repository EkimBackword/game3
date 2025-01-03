import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import {
    RhEndTurnResultOptions,
    RhEventEndTurnArgs,
    RhMoveTypes,
} from '../../../models/game-move-args-types';

@Component({
    selector: 'app-rh-logs-end-turn',
    standalone: false,

    templateUrl: './rh-logs-end-turn.component.html',
    styleUrl: './rh-logs-end-turn.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsEndTurnComponent {

    args = input.required<RhEventEndTurnArgs>();

    result = computed(() => {
        const args = this.args();
        const log = args.options?.log ?? [];
        const endTurnLog = log.find(p => p.action.payload.type === RhMoveTypes.endTurn);
        return (endTurnLog?.action.result as RhEndTurnResultOptions) ?? {
            returnToCamp: false,
            selectedCards: [],
        };
    })

}
