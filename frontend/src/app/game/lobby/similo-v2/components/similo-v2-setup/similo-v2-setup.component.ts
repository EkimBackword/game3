import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';

import { SimiloDlcDeckList } from 'src/app/game/similo/models/similo-dlc';
import { SessionQuery } from 'src/app/session/session.query';
import { NameValue } from 'src/app/shared/models/shared.types';

import { GamePlayerId } from '@shared/game/game-constants';
import { GamePlayerBase } from '@shared/game/game-players';
import { SimiloDlcEnum } from '@shared/similo/similo-dlc.types';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import {
    SimiloV2GameType,
    SimiloV2SetupData,
} from '../../models/similo-game';

@Component({
    selector: 'app-similo-v2-setup',
    templateUrl: './similo-v2-setup.component.html',
    styleUrls: ['./similo-v2-setup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloV2SetupComponent {

    lobbyService = inject(LobbyService);
    sessionQuery = inject(SessionQuery);

    client: LobbyClient<SimiloV2GameType, SimiloV2SetupData> = this.lobbyService.client;

    mainDecks: NameValue<string, SimiloDlcEnum>[];
    helpDecks: NameValue<string, SimiloDlcEnum | null>[];
    playersForSettings = computed(() => {
        const players = this.client.game.players();
        return [...players.entries()].map(([id, player]) => {
            const result: NameValue = {
                name: player.name,
                value: id,
            };
            return result;
        });
    });

    players = computed(() => {
        const players = this.client.game.players();
        return [...players.values()].map((player) => {
            const result = {
                ...player,
                color: player.online ? 'primary' : 'warn',
                icon: player.online ? 'wifi' : 'wifi_off',
            };
            return result;
        });
    });

    currentPlayer = computed(() => {
        const players = this.client.game.players();
        const userState = this.sessionQuery.getValue();
        return players.get(userState.id);
    });

    constructor() {
        this.mainDecks = SimiloDlcDeckList.map(deck => {
            const result: NameValue<string, SimiloDlcEnum> = {
                name: deck.name,
                value: deck.dlc_name,
            };
            return result;
        });

        this.helpDecks = [
            {
                name: 'Соответствует колоде персонажей',
                value: null,
            },
            ...this.mainDecks,
        ];
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    trackByNameValue(index: number, item: NameValue | null) {
        return item?.value;
    }

    joinToGame() {
        const userState = this.sessionQuery.getValue();
        if (userState == null) {
            return;
        }

        const player: GamePlayerBase = {
            id: userState.id,
            sessionId: userState.id,
            name: userState.name,
        };
        this.lobbyService.joinToGame({
            player
        });
    }

    leaveFromGame(playerId: GamePlayerId) {
        const players = this.client.game.players();
        const player = players.get(playerId);
        if (player == null) {
            return;
        }
        this.lobbyService.leaveFromGame({
            player
        });
    }

    // Пока что это не нужно и работает не правильно
    // kickUser(userId: string) {
    //     this.lobbyService.kickUser(userId);
    // }

    masterPlayerIdChanged(masterPlayerId: string) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result: SimiloV2SetupData = {
            ...setupData,
            masterPlayerId,
        };
        this.lobbyService.changeSetupData(result)
    }

    mainDlcChanged(mainDlc: SimiloDlcEnum) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result: SimiloV2SetupData = {
            ...setupData,
            mainDlc,
            helpDlc: null,
        };
        this.lobbyService.changeSetupData(result)
    }

    helpDlcChanged(value: SimiloDlcEnum) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const dlc = SimiloDlcDeckList.find(p => p.dlc_name === value);
        const result: SimiloV2SetupData = {
            ...setupData,
            helpDlc: dlc?.dlc_name ?? null,
        };
        this.lobbyService.changeSetupData(result)
    }


}
