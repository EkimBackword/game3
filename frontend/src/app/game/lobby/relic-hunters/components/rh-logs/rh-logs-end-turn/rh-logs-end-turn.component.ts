import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import {
    RhEndTurnResultOptions,
    RhGameActionsEventPayload,
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

    payload = input.required<RhGameActionsEventPayload>();

    result = computed(() => {
        const payload = this.payload();
        if (payload.type !== 'endTurn') {
            return null;
        }
        const log = payload.args.options?.log ?? [];
        const endTurnLog = log.find(p => p.action.payload.type === RhMoveTypes.endTurn);
        if (endTurnLog == null) {
            return null;
        }
        return endTurnLog.action.result as RhEndTurnResultOptions;
    })

}
