import { Injectable } from '@angular/core';

import {
    Store,
    StoreConfig,
} from '@datorama/akita';
import { SimiloGameInfoState } from '@shared/similo/similo-game.types';

import { createInitialSimiloGameInfoState } from './similo-game-info.types';

@Injectable()
@StoreConfig({ name: 'similo-game-info' })
export class SimiloGameInfoStore extends Store<SimiloGameInfoState> {

    constructor() {
        super(createInitialSimiloGameInfoState({
            name: 'Not found',
        }));
    }

}
