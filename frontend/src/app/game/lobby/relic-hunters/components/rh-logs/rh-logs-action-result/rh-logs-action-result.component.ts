import {
    ChangeDetectionStrategy,
    Component,
    input,
} from '@angular/core';

import {
    RhGameActionPayload,
    RhGameActionType,
} from '../../../models/game-actions';

@Component({
    selector: 'app-rh-logs-action-result',
    standalone: false,
    templateUrl: './rh-logs-action-result.component.html',
    styleUrl: './rh-logs-action-result.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsActionResultComponent {

    payload = input.required<RhGameActionPayload>();

    RhGameActionType = RhGameActionType;

}
