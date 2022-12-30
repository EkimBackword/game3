import { Injectable } from '@angular/core';

import {
    Store,
    StoreConfig,
} from '@datorama/akita';
import { GameInfoState } from '@shared/clank/clank-game.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import { ClankMapConfigIds } from '@shared/clank/clank-map.types';

import { createInitialGameInfoState } from './game-info.types';

@Injectable()
@StoreConfig({ name: 'game-info' })
export class GameInfoStore extends Store<GameInfoState> {

    constructor() {
        super(createInitialGameInfoState({
            name: 'Not found',
            mapDlcId: ClankDlcEnum.clank,
            mapId: ClankMapConfigIds.clank_1,
        }));
    }

}
