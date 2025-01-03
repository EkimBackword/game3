import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostBinding,
    input,
} from '@angular/core';

import { RhBenefitComponentData } from '../../../models/benefit';
import { RelicHuntersCellInfo } from '../../../models/cell';
import { RelicHuntersTileSettings } from '../../../models/tile';

@Component({
    selector: 'app-rh-logs-cell',
    standalone: false,

    templateUrl: './rh-logs-cell.component.html',
    styleUrl: './rh-logs-cell.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhLogsCellComponent {

    cell = input.required<RelicHuntersCellInfo>();

    tileType = computed<RhBenefitComponentData>(() => {
        const cell = this.cell();
        return {
            key: 'tileType',
            value: 0,
            tileType: cell.tileType,
            size: 40,
            inlineView: true,
            hideValue: true,
        };
    });

    @HostBinding('style.--logs-cell-size.px') size = 150;
    @HostBinding('style.--logs-cell-zoom') zoom = this.size / RelicHuntersTileSettings.width;

}
