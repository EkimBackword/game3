import { Injectable } from '@angular/core';

import { ClankTokenConfig } from '@shared/clank/clank-token.types';

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
        ...getSecretTokens(false),
        ...getMapTokens(false),
        ...getMarketTokens(false),
    ];

    constructor() { }

    getMapTokens() {
        const tokens = [
            ...getSecretTokens(true),
            ...getMapTokens(true),
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
