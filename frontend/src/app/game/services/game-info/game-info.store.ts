import { Injectable } from '@angular/core';

import {
    Store,
    StoreConfig,
} from '@datorama/akita';

import {
    createInitialGameInfoState,
    GameInfoState,
} from './game-info.types';

@Injectable()
@StoreConfig({ name: 'game-info' })
export class GameInfoStore extends Store<GameInfoState> {

    constructor() {
        super(createInitialGameInfoState());
    }

}
