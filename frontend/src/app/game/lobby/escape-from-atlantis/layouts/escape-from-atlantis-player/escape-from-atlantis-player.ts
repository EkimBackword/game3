import {
    computed,
    Injector,
    signal,
    Signal,
    WritableSignal,
} from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { isKeyInRecord } from 'src/app/shared/models/shared.types';

import {
    faHourglassStart,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GamePlayerColorList } from '@shared/clank/clank-player.types';
import { GamePlayer } from '@shared/game/game-players';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { EscapeFromAtlantisGameMeepleDisplayInfo } from '../../components/escape-from-atlantis-game-meeple/escape-from-atlantis-game-meeple';
import { EscapeFromAtlantisPlayerMeepleDisplayInfo } from '../../components/escape-from-atlantis-player-meeple/escape-from-atlantis-player-meeple';
import { EscapeFromAtlantisTileDisplayInfo } from '../../components/escape-from-atlantis-tile/escape-from-atlantis-tile';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisCellMeepleType } from '../../models/meeples';
import { EscapeFromAtlantisPlayer } from '../../models/player';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';

const EscapeFromAtlantisPlayerIcons = {
    user: faUser,
    active: faHourglassStart,
};

export interface EscapeFromAtlantisPlayerInfo extends EscapeFromAtlantisPlayer, GamePlayer {
}

export class EscapeFromAtlantisPlayerDisplayInfo {

    private configSignal: WritableSignal<EscapeFromAtlantisPlayerInfo>;

    readonly info: Signal<Readonly<EscapeFromAtlantisPlayerInfo>>;

    id = computed(() => {
        const config = this.configSignal();
        return config.id;
    });

    isActivePlayer = computed(() => {
        const id = this.id();
        const state = this.client.game.state();
        return state?.context.currentPlayerId === id;
    });

    isCurrentPlayer = computed(() => {
        const id = this.id();
        const userState = this.sessionQuery.getValue();
        return userState.id === id;
    });

    icon = computed(() => {
        return this.isActivePlayer()
            ? EscapeFromAtlantisPlayerIcons.active
            : EscapeFromAtlantisPlayerIcons.user;
    });

    colorInfo = computed(() => {
        const config = this.configSignal();
        return GamePlayerColorList[config.color];
    });

    meeples = computed(() => {
        const config = this.configSignal();
        return config.meeples.map((meeple, index) => {
            if (meeple.type === EscapeFromAtlantisCellMeepleType.GameMeeple) {
                return new EscapeFromAtlantisGameMeepleDisplayInfo(
                    {
                        ...meeple,
                        index,
                        cell: null,
                        player: this,
                    },
                    this.injector,
                );
            }
            return new EscapeFromAtlantisPlayerMeepleDisplayInfo(
                {
                    ...meeple,
                    index,
                    cell: null,
                    gameMeeple: null,
                    player: this,
                },
                this.injector,
            );
        });
    });

    gameMeeples = computed(() => {
        const meeples = this.meeples();
        return meeples.filter((p): p is EscapeFromAtlantisGameMeepleDisplayInfo => p instanceof EscapeFromAtlantisGameMeepleDisplayInfo);
    });

    playerMeeples = computed(() => {
        const meeples = this.meeples();
        return meeples.filter((p): p is EscapeFromAtlantisPlayerMeepleDisplayInfo => p instanceof EscapeFromAtlantisPlayerMeepleDisplayInfo);
    });

    tiles = computed(() => {
        const config = this.configSignal();
        return config.tiles.map((tile) => {
            return new EscapeFromAtlantisTileDisplayInfo(
                {
                    ...tile,
                    cell: null,
                    player: this,
                },
                this.injector,
            );
        });
    });

    context = computed(() => {
        const config = this.configSignal();
        const context = this.client.game.state()?.context.activePlayers?.[config.id];
        return context;
    });

    stageName = computed(() => {
        const context = this.context();
        const builder = this.builder();
        const stage = context?.stage;
        return stage != null && builder?.stages != null && isKeyInRecord(stage, builder.stages)
            ? builder.stages[stage].config.name
            : null;
    });

    private sessionQuery = this.injector.get(SessionQuery);
    private lobbyService = this.injector.get(LobbyService);
    private client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    private builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    constructor(
        config: EscapeFromAtlantisPlayerInfo,
        private injector: Injector,
    ) {
        this.configSignal = signal(config);
        this.info = this.configSignal.asReadonly();
    }

    update(config: EscapeFromAtlantisPlayerInfo) {
        this.configSignal.set(config);
    }

}
