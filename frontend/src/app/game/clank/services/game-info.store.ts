import { Injectable } from '@angular/core';

import {
    Store,
    StoreConfig,
} from '@datorama/akita';
import { GameInfoState } from '@shared/clank/clank-game.types';

import { createInitialGameInfoState } from './game-info.types';

@Injectable()
@StoreConfig({ name: 'game-info' })
export class GameInfoStore extends Store<GameInfoState> {

    constructor() {
        super(createInitialGameInfoState());
    }

}
