import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { EscapeFromAtlantisTileDisplayInfo } from './escape-from-atlantis-tile';

@Component({
    selector: 'app-escape-from-atlantis-tile',
    templateUrl: './escape-from-atlantis-tile.component.html',
    styleUrls: ['./escape-from-atlantis-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EscapeFromAtlantisTileComponent implements OnChanges {

    @Input({ required: true }) tile!: EscapeFromAtlantisTileDisplayInfo;

    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};

    ngOnChanges(changes: SimpleChanges): void {
        this.style = this.tile.style();
    }

}
