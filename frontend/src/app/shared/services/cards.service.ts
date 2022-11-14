import { Injectable } from '@angular/core';

import {
    ClankCardConfig,
    ClankCardState,
    ClankSelectDeckValue,
} from '@shared/clank/clank-card.types';
import {
    ClankDlcEnum,
    ClankDlcList,
} from '@shared/clank/clank-info.types';

import {
    getClankDeckCards,
    getClankReserveCards,
    getClankStartCards,
} from '../models/cards/cards_clank.data';

@Injectable({
    providedIn: 'root',
})
export class CardsService {

    readonly store: ClankCardConfig[] = [
        ...getClankReserveCards(1, false),
        ...getClankStartCards('', false),
        ...getClankDeckCards(false),
    ];

    reserveDecks: Partial<Record<ClankDlcEnum, (userCount: number) => ClankCardConfig[]>> = {
        [ClankDlcEnum.clank]: (userCount) => getClankReserveCards(userCount, true),
    };

    startDecks: Partial<Record<ClankDlcEnum, (playerId: string) => ClankCardConfig[]>> = {
        [ClankDlcEnum.clank]: (playerId) => getClankStartCards(playerId, true),
    };

    shareDecks: Partial<Record<ClankDlcEnum, () => ClankCardConfig[]>> = {
        [ClankDlcEnum.clank]: () => getClankDeckCards(true),
    };

    constructor() { }

    getReserveDecksCards(mapDlcId: ClankDlcEnum, userCount: number) {
        const ids: ClankDlcEnum[] = [ClankDlcEnum.clank, mapDlcId];
        return ids.flatMap((id) => this.mappingToCardStates(this.reserveDecks[id]?.(userCount) ?? []));
    }

    getSelectStartDecks(): ClankSelectDeckValue[] {
        return ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: dlc.id === ClankDlcEnum.clank || this.startDecks[dlc.id] == null,
        }));
    }

    getStartDeckCards(id: ClankDlcEnum, playerId: string) {
        return this.mappingToCardStates(this.startDecks[id]?.(playerId) ?? []);
    }

    getSelectShareDecks(): ClankSelectDeckValue[] {
        return ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: dlc.id === ClankDlcEnum.clank || this.startDecks[dlc.id] == null,
        }));
    }

    getShareDecksCards(ids: ClankDlcEnum[]) {
        return ids.flatMap((id) => this.mappingToCardStates(this.shareDecks[id]?.() ?? []));
    }

    private mappingToCardStates(configs: ClankCardConfig[]) {
        return configs.map(config => {
            const state: ClankCardState = {
                id: config.id,
                index: config.index,
                position: config.position,
                player_id: config.player_id,
            };
            return state;
        });
    }

}
