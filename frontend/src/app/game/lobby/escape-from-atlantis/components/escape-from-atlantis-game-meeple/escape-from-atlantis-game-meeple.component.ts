import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';

import { EscapeFromAtlantisGameMeepleDisplayInfo } from './escape-from-atlantis-game-meeple';

@Component({
  selector: 'app-escape-from-atlantis-game-meeple',
  templateUrl: './escape-from-atlantis-game-meeple.component.html',
  styleUrls: ['./escape-from-atlantis-game-meeple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EscapeFromAtlantisGameMeepleComponent {

    @Input({ required: true }) meeple!: EscapeFromAtlantisGameMeepleDisplayInfo;

}

