import {
    ChangeDetectionStrategy,
    Component,
    input,
} from '@angular/core';

import { RelicHuntersCardInfo } from '../../../models/cards';

@Component({
    selector: 'app-rh-logs-card',
    standalone: false,

    templateUrl: './rh-logs-card.component.html',
    styleUrl: './rh-logs-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhLogsCardComponent {

    card = input.required<RelicHuntersCardInfo>();

}
