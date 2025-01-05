import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { RhBenefitComponentData } from '../../../models/benefit';
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

    args = input.required<RhGetPointsByMoveArgs | RhGetPointsByCardArgs>();
    name = input.required<string>();

    text = computed(() => {
        const name = this.name();
        return `Выполнил действие "${name}" и получил:`;
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
