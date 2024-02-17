import { Type } from '@angular/core';

import { GameRouteEnum } from 'src/app/game.routing.enum';

import {
    GameConfig,
    GameConfigCreatorConfig,
} from '@shared/game/game-config';

export interface LobbyGameBuilder<
    GameType extends Record<string, any> = any,
    SetupData extends Record<string, any> = any,
> {
    path: GameRouteEnum;
    config: GameConfigCreatorConfig;
    setupDataSettings: Type<any>;

    getInitialSetupData : () => SetupData;
    getConfig: () => GameConfig<GameType, SetupData>;
}
