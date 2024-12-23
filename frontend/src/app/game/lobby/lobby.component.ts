import {
    ChangeDetectionStrategy,
    Component,
    effect,
    OnDestroy,
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';

import { LobbyStatusIdEnum } from '@shared/lobby/lobby';

import { LobbyService } from './services/lobby.service';

@Component({
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LobbyComponent implements OnDestroy {

    private inited = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private lobbyService: LobbyService,
    ) {
        effect(() => {
            const statusId = this.lobbyService.client.statusId();

            if (!this.inited) {
                this.inited = true;
                return;
            }

            if (statusId === LobbyStatusIdEnum.Lobby) {
                const path = GameRouteEnum.Settings;
                this.router.navigate([path], {
                    relativeTo: this.activatedRoute,
                });
                return;
            }

            if (statusId === LobbyStatusIdEnum.Game) {
                const path = this.lobbyService.client.game.getPath();
                this.router.navigate([path], {
                    relativeTo: this.activatedRoute,
                });
                return;
            }
        })
    }

    ngOnDestroy(): void {
        this.lobbyService.disconnect();
    }

}
