import {
    ChangeDetectionStrategy,
    Component,
    inject,
} from '@angular/core';

import { LobbyGameChangeOptions } from '@shared/lobby/lobby-game';

import { LobbyGamesIdEnum } from '../models/lobby-games.enum';
import { LobbyGamesStoreService } from '../services/lobby-games-store.service';
import { LobbyService } from '../services/lobby.service';

@Component({
    templateUrl: './lobby-settings.component.html',
    styleUrls: ['./lobby-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LobbySettingsComponent {

    private lobbyService = inject(LobbyService);
    private lobbyGamesStoreService = inject(LobbyGamesStoreService);

    client = this.lobbyService.client;

    lobbyGames = this.lobbyGamesStoreService.getGameList();

    onGameChanged(value: string) {
        const id: LobbyGamesIdEnum = Number(value);
        if (id == null) {
            console.warn(`Game #${id} was not found`);
            return;
        }

        const gameBuilder = this.lobbyGamesStoreService.getGameBuilder(id);
        if (gameBuilder == null) {
            console.warn(`Game #${id} builder was not found`);
            return;
        }

        const result: LobbyGameChangeOptions = {
            id,
            setupData: gameBuilder.getInitialSetupData(),
        };
        this.lobbyService.changeGame(result);
    }

    startGame() {
        const state = this.client.game.getInitGameState();
        if (state == null) {
            console.warn(`State was not created`);
            return;
        }

        this.lobbyService.startGame(state);
    }

}
