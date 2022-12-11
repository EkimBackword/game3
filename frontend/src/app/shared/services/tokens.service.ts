import { Injectable } from '@angular/core';

import { ClankTokenConfig } from '@shared/clank/clank-token.types';

import {
    getMarketTokens,
    getSecretTokens,
} from '../models/tokens/token.data';

@Injectable({
    providedIn: 'root',
})
export class TokensService {

    readonly store: ClankTokenConfig[] = [
        ...getSecretTokens(false),
        ...getMarketTokens(false),
    ];

    constructor() { }

    getMapTokens() {
        const tokens = [
            ...getSecretTokens(true),
            ...getMarketTokens(true),
        ];
        return tokens;
    }

    getMarketTokens() {
        const tokens = [
            ...getMarketTokens(true),
        ];
        return tokens;
    }

}
