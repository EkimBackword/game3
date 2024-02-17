import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';

import { SimiloDlcDeckList } from 'src/app/game/similo/models/similo-dlc';
import { SessionQuery } from 'src/app/session/session.query';
import { NameValue } from 'src/app/shared/models/shared.types';

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
    changeDetection: ChangeDetectionStrategy.OnPush
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
                name: 'Соответствует основной',
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
        this.lobbyService.joinToGame();
    }

    leaveFromGame() {
        this.lobbyService.leaveFromGame();
    }

    kickUser(userId: string) {
        this.lobbyService.kickUser(userId);
    }

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

    helpDlcChanged(helpDlc: SimiloDlcEnum) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result: SimiloV2SetupData = {
            ...setupData,
            helpDlc,
        };
        this.lobbyService.changeSetupData(result)
    }


}
