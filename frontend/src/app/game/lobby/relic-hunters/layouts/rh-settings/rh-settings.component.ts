import {
    ChangeDetectionStrategy,
    Component,
    computed,
} from '@angular/core';

import * as lodash from 'lodash';
import { SessionQuery } from 'src/app/session/session.query';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { RelicHuntersSetupData } from '../../models/game-setup-data';
import { RelicHuntersGameType } from '../../models/game-type';
import {
    RelicHuntersHeroColorEnum,
    RelicHuntersHeroColorIds,
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
})
export class RhSettingsComponent {

    client: LobbyClient<RelicHuntersGameType, RelicHuntersSetupData> = this.lobbyService.client;

    colorIds = RelicHuntersHeroColorIds;
    colorTaxanomy = RelicHuntersHeroColorTaxonomy;

    players = computed(() => {
        const players = this.client.game.players();
        const playerMap = this.client.game.setupData()?.playerMap ?? {};
        return [...players.values()].map((player) => {
            const colorId = playerMap[player.id].color;
            const colorInfo = RelicHuntersHeroColorTaxonomy[colorId];
            const heroSize = RelicHuntersHeroSettings.sizeHero;
            const positionHeroX = colorInfo.column * heroSize;
            const positionHeroY = RelicHuntersHeroSettings.heroIndex * heroSize;
            const heroStyle: Partial<CSSStyleDeclaration> = {
                width: `${heroSize}px`,
                height: `${heroSize}px`,
                backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
                backgroundPosition: `-${positionHeroX}px -${positionHeroY}px`,
                backgroundSize: RelicHuntersHeroSettings.backgroundSize,
                flexShrink: '0',
            };
            const result = {
                ...player,
                color: {
                    ...colorInfo,
                    id: colorId,
                    heroStyle,
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

    mapIds = RelicHuntersMapIds;
    mapTaxanomy = RelicHuntersMapTaxonomy;

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

        const result: RelicHuntersSetupData = {
            ...setupData,
            playerMap: {
                ...setupData.playerMap,
                [userState.id]: {
                    id: userState.id,
                    name: userState.name,
                    color,
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

    changeColor(color: RelicHuntersHeroColorEnum) {
        const setupData = this.client.game.setupData();
        const userState = this.sessionQuery.getValue();
        if (setupData == null || userState == null) {
            return;
        }

        const result: RelicHuntersSetupData = {
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
