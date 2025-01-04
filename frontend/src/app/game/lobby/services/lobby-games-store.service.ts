import { Injectable } from '@angular/core';

import { DynamicComponentData } from 'src/app/shared/models/dynamic-component.models';

import { GameFlow } from '../models/game-flow';
import { LobbyGameBuilder } from '../models/lobby-games-store';
import { LobbyGamesIdEnum } from '../models/lobby-games.enum';
import { RelicHuntersGameBuilder } from '../relic-hunters/models/game-builder';
import { SimiloV2GameBuilder } from '../similo-v2/models/similo-game';

@Injectable()
export class LobbyGamesStoreService {

    private games = new Map<LobbyGamesIdEnum, LobbyGameBuilder>();

    constructor() {
        this.addGame(new SimiloV2GameBuilder());
        // this.addGame(new EscapeFromAtlantisGameBuilder());
        this.addGame(new RelicHuntersGameBuilder());
    }

    getGameList() {
        return [...this.games.values()];
    }

    getGameBuilder(id: LobbyGamesIdEnum) {
        return this.games.get(id) ?? null;
    }

    getSetupDataSettings(id: LobbyGamesIdEnum) {
        const gameBuilder = this.games.get(id);

        const result: DynamicComponentData | null = gameBuilder != null
            ? {
                component: gameBuilder.setupDataSettings
            }
            : null;
        return result;
    }

    getFlow(id: LobbyGamesIdEnum) {
        const gameBuilder = this.games.get(id);

        if (gameBuilder == null) {
            return null;
        }

        const config = gameBuilder.getConfig();
        return new GameFlow(config);
    }

    getPath(id: LobbyGamesIdEnum) {
        const gameBuilder = this.games.get(id);

        if (gameBuilder == null) {
            return null;
        }

        return gameBuilder.path
    }

    private addGame<
        GameType extends Record<string, any> = any,
        SetupData extends Record<string, any> = any,
    >(item: LobbyGameBuilder<GameType, SetupData>) {
        this.games.set(item.config.id, item);
    }

}
