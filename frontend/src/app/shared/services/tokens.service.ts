import { Injectable } from '@angular/core';

import { ClankTokenConfig } from '@shared/clank/clank-token.types';

import { preloadImage } from '../models/game.types';
import {
    getMapTokens,
    getMarketTokens,
    getSecretTokens,
} from '../models/tokens/token.data';

@Injectable({
    providedIn: 'root',
})
export class TokensService {

    readonly store: ClankTokenConfig[] = [
        ...getSecretTokens(4, false),
        ...getMapTokens(false),
        ...getMarketTokens(4, false),
    ];

    constructor() {
        preloadImage(this.store.map(p => p.url));
    }

    getMapTokens(playerCount: number) {
        const tokens = [
            ...getSecretTokens(playerCount, true),
            ...getMapTokens(true),
        ];
        return tokens;
    }

    getMarketTokens(playerCount: number) {
        const tokens = [
            ...getMarketTokens(playerCount, true),
        ];
        return tokens;
    }

}
