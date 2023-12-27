import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import { LobbyService } from '../services/lobby.service';

@Component({
    templateUrl: './lobby-settings.component.html',
    styleUrls: ['./lobby-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbySettingsComponent {

    constructor(
        public lobbyService: LobbyService,
    ) {
    }

}
