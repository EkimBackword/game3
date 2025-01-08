import {
    ChangeDetectionStrategy,
    Component,
    computed,
} from '@angular/core';

import * as lodash from 'lodash';
import { lastValueFrom } from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';
import { SingleInputModalComponentResult } from 'src/app/shared/modals/single-input-modal/single-input-modal.model';
import { recordKeys } from 'src/app/shared/models/shared.types';
import { DialogService } from 'src/app/shared/services/dialog.service';

import { guid } from '@datorama/akita';
import { GamePlayerId } from '@shared/game/game-constants';
import {
    GamePlayer,
    GamePlayerBase,
} from '@shared/game/game-players';

import { LobbyService } from '../../../services/lobby.service';
import { RhLobbyClient } from '../../models/game-lobby-types';
import { RelicHuntersSetupData } from '../../models/game-setup-data';
import {
    RelicHuntersHeroColorEnum,
    RelicHuntersHeroColorInfoForSetup,
    RelicHuntersHeroColorTaxonomy,
    RelicHuntersHeroSettings,
} from '../../models/hero';
import {
    RelicHuntersMapIds,
    RelicHuntersMapTaxonomy,
} from '../../models/map';

@Component({
    selector: 'app-rh-settings',
    templateUrl: './rh-settings.component.html',
    styleUrls: ['./rh-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhSettingsComponent {

    client: RhLobbyClient = this.lobbyService.client;

    private playerMapByColor = computed(() => {
        const players = this.client.game.players();
        const setupData = this.client.game.setupData();
        const playerMap = new Map<RelicHuntersHeroColorEnum, GamePlayer>();
        for (const data of Object.values(setupData?.playerMap ?? {})) {
            const player = players.get(data.id);
            if (player != null) {
                playerMap.set(data.color, {
                    ...player,
                    name: data.name,
                });
            }
        }
        return playerMap;
    });

    private countCurrentUser = computed(() => {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        const list = Object.values(setupData?.playerMap ?? {}).filter(p => p.sessionId === userState.id);
        return list.length;
    });

    joinBtnName = computed(() => {
        return this.countCurrentUser() > 0
            ? 'Добавить игрока'
            : 'Присоединиться';
    })

    heroes = computed(() => {
        const playerMap = this.playerMapByColor();
        return recordKeys(RelicHuntersHeroColorTaxonomy).map((colorId) => {
            const player = playerMap.get(colorId);
            const colorInfo = RelicHuntersHeroColorTaxonomy[colorId];
            const heroSize = RelicHuntersHeroSettings.sizeHero;
            const positionHeroX = colorInfo.column * heroSize;
            const positionHeroY = RelicHuntersHeroSettings.heroIndex * heroSize;
            const color: RelicHuntersHeroColorInfoForSetup = {
                ...colorInfo,
                id: colorId,
                heroStyle: {
                    width: `${heroSize}px`,
                    height: `${heroSize}px`,
                    backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
                    backgroundPosition: `-${positionHeroX}px -${positionHeroY}px`,
                    backgroundSize: RelicHuntersHeroSettings.backgroundSize,
                    flexShrink: '0',
                },
            };
            const result = {
                player,
                color,
                icon: {
                    color: player?.online ? 'primary' : 'warn',
                    name: player?.online ? 'wifi' : 'wifi_off',
                },
            };
            return result;
        });
    });

    mapIds = RelicHuntersMapIds;
    mapTaxanomy = RelicHuntersMapTaxonomy;

    constructor(
        private lobbyService: LobbyService,
        private dialogService: DialogService,
        public sessionQuery: SessionQuery,
    ) {
    }

    async joinToGame(color: RelicHuntersHeroColorInfoForSetup) {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        if (setupData == null || userState == null) {
            return;
        }

        const playerName = await this.getPlayerName(userState.name, color);
        if (!playerName) {
            return;
        }

        const player: GamePlayerBase = {
            id: `${userState.id}-${guid()}`,
            sessionId: userState.id,
            name: playerName.value,
        };
        const result: RelicHuntersSetupData = {
            ...setupData,
            playerMap: {
                ...setupData.playerMap,
                [player.id]: {
                    ...player,
                    color: color.id,
                },
            }
        };
        this.lobbyService.joinToGame({
            player,
            setupData: result,
        });
    }

    private async getPlayerName(name: string, color: RelicHuntersHeroColorInfoForSetup) {
        const countCurrentUser = this.countCurrentUser();
        if (!countCurrentUser) {
            const result: SingleInputModalComponentResult ={
                value: name,
            };
            return result;
        }

        const matDialogRef = this.dialogService.openSingleInput({
            title: `${color.name} (${color.colorName})`,
            label: 'Имя игрока:',
            value: `${name} (Копия ${countCurrentUser})`,
            applyText: 'Добавить игрока'
        }, {
            width: '500px',
        });
        return await lastValueFrom(matDialogRef.afterClosed());
    }

    leaveFromGame(playerId: GamePlayerId) {
        const setupData = this.client.game.setupData();
        const players = this.client.game.players();
        const player = players.get(playerId);
        if (setupData == null || player == null) {
            return;
        }

        const result = lodash.cloneDeep(setupData);
        if (result.playerMap[player.id] != null) {
            delete result.playerMap[player.id];
        }
        this.lobbyService.leaveFromGame({
            player,
            setupData: result,
        });
    }

    // Пока что это не нужно и работает не правильно
    // kickUser(userId: string) {
    //     const setupData = this.client.game.setupData();
    //     if (setupData == null) {
    //         return;
    //     }

    //     const result = lodash.cloneDeep(setupData);
    //     if (result.playerMap[userId] != null) {
    //         delete result.playerMap[userId];
    //     }
    //     this.lobbyService.kickUser(userId, result);
    // }

    changeSetupData<K extends keyof RelicHuntersSetupData>(
        key: K,
        value: RelicHuntersSetupData[K],
    ) {
        const setupData = this.client.game.setupData();
        if (setupData == null) {
            return;
        }

        const result: RelicHuntersSetupData = {
            ...setupData,
            [key]: value,
        };
        this.lobbyService.changeSetupData(result);
    }

}
