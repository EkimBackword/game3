import {
    ChangeDetectionStrategy,
    Component,
    computed,
} from '@angular/core';

import * as lodash from 'lodash';
import { SessionQuery } from 'src/app/session/session.query';

import {
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import {
    EscapeFromAtlantisEndConditionIds,
    EscapeFromAtlantisEndConditionTaxanomy,
    EscapeFromAtlantisWinConditionIds,
    EscapeFromAtlantisWinConditionTaxanomy,
} from '../../models/conditions';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';

@Component({
    selector: 'app-escape-from-atlantis-settings',
    templateUrl: './escape-from-atlantis-settings.component.html',
    styleUrls: ['./escape-from-atlantis-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EscapeFromAtlantisSettingsComponent {

    client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;

    colorIds = GamePlayerColorIds.filter(colorId => GamePlayerColorList[colorId].forPlayer);
    colorTaxanomy = GamePlayerColorList;

    players = computed(() => {
        const players = this.client.game.players();
        const playerMap = this.client.game.setupData()?.playerMap ?? {};
        return [...players.values()].map((player) => {
            const result = {
                ...player,
                color: {
                    ...GamePlayerColorList[playerMap[player.id].color],
                    id: playerMap[player.id].color,
                },
                icon: {
                    color: player.online ? 'primary' : 'warn',
                    name: player.online ? 'wifi' : 'wifi_off',
                },
            };
            return result;
        });
    });

    currentPlayer = computed(() => {
        const players = this.client.game.players();
        const userState = this.sessionQuery.getValue();
        return players.get(userState.id);
    });

    freeColors = computed(() => {
        const playerMap = this.client.game.setupData()?.playerMap ?? null;
        if (playerMap == null) {
            return this.colorIds;
        }
        const ids = Object.values(playerMap).map(p => p.color);
        return this.colorIds.filter(id => !ids.includes(id));
    });

    endConditionIds = EscapeFromAtlantisEndConditionIds;
    endConditionTaxanomy = EscapeFromAtlantisEndConditionTaxanomy;

    winConditionIds = EscapeFromAtlantisWinConditionIds;
    winConditionTaxanomy = EscapeFromAtlantisWinConditionTaxanomy;

    constructor(
        private lobbyService: LobbyService,
        private sessionQuery: SessionQuery,
    ) {
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    joinToGame() {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        if (setupData == null || userState == null) {
            return;
        }

        const freeColors = this.freeColors();
        const color = freeColors.pop();
        if (color == null) {
            return;
        }

        const result: EscapeFromAtlantisSetupData = {
            ...setupData,
            playerMap: {
                ...setupData.playerMap,
                [userState.id]: {
                    id: userState.id,
                    name: userState.name,
                    color,
                    meeples: [],
                    tiles: [],
                },
            }
        };
        this.lobbyService.joinToGame(result);
    }

    leaveFromGame() {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        if (setupData == null || userState == null) {
            return;
        }

        const result = lodash.cloneDeep(setupData);
        if (result.playerMap[userState.id] != null) {
            delete result.playerMap[userState.id];
        }
        this.lobbyService.leaveFromGame(result);
    }

    kickUser(userId: string) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result = lodash.cloneDeep(setupData);
        if (result.playerMap[userId] != null) {
            delete result.playerMap[userId];
        }
        this.lobbyService.kickUser(userId, result);
    }

    changeColor(color: GamePlayerColorIdEnum) {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        if (setupData == null || userState == null) {
            return;
        }

        const result: EscapeFromAtlantisSetupData = {
            ...setupData,
            playerMap: {
                ...setupData.playerMap,
                [userState.id]: {
                    ...setupData.playerMap[userState.id],
                    color,
                },
            }
        };
        this.lobbyService.changeSetupData(result);
    }

    changeSetupData<K extends keyof EscapeFromAtlantisSetupData>(
        key: keyof EscapeFromAtlantisSetupData,
        value: EscapeFromAtlantisSetupData[K],
    ) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result: EscapeFromAtlantisSetupData = {
            ...setupData,
            [key]: value,
        };
        this.lobbyService.changeSetupData(result);
    }

}
