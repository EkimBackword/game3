import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';

import { EscapeFromAtlantisPlayerMeepleDisplayInfo } from './escape-from-atlantis-player-meeple';

@Component({
    selector: 'app-escape-from-atlantis-player-meeple',
    templateUrl: './escape-from-atlantis-player-meeple.component.html',
    styleUrls: ['./escape-from-atlantis-player-meeple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EscapeFromAtlantisPlayerMeepleComponent {

    @Input({ required: true }) meeple!: EscapeFromAtlantisPlayerMeepleDisplayInfo;
    @Input() showValue = false;

}
