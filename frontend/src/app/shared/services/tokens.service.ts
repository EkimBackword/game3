import { Injectable } from '@angular/core';

import {
    ClankTokenConfig,
    ClankTokenState,
} from '@shared/clank/clank-token.types';

import { getSecretTokens } from '../models/tokens/token.data';

@Injectable({
    providedIn: 'root',
})
export class TokensService {

    readonly store: ClankTokenConfig[] = [
        ...getSecretTokens(false),
    ];

    constructor() { }

    getTokens() {
        const tokens = getSecretTokens(true) ?? [];
        return this.mappingToTokenStates(tokens);
    }

    getTokenInfo(state?: ClankTokenState) {
        if (state == null) {
            return;
        }
        const [find_string] = state.id.split('__');
        return this.store.find(p => p.find_string === find_string);
    }

    private mappingToTokenStates(configs: ClankTokenConfig[]) {
        return configs.map(config => {
            const state: ClankTokenState = {
                id: config.id,
                dlc_name: config.dlc_name,
                type: config.type,
                element_type: config.element_type,
            };
            return state;
        });
    }

}
