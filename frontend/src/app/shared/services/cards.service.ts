import { Injectable } from '@angular/core';

import { ClankCard } from '../models/cards/card.class';
import { ClankSelectDeckValue } from '../models/cards/cards.types';
import {
    getClankDeckCards,
    getClankReserveCards,
    getClankStartCards,
} from '../models/cards/cards_clank.data';
import {
    ClankDlcEnum,
    ClankDlcName,
} from '../models/clank.types';

@Injectable({
    providedIn: 'root',
})
export class CardsService {

    reserveDecks: Partial<Record<ClankDlcEnum, (userCount: number) => ClankCard[]>> = {
        [ClankDlcEnum.clank]: (userCount) => getClankReserveCards(userCount),
    };

    startDecks: Partial<Record<ClankDlcEnum, () => ClankCard[]>> = {
        [ClankDlcEnum.clank]: () => getClankStartCards(),
    };

    shareDecks: Partial<Record<ClankDlcEnum, () => ClankCard[]>> = {
        [ClankDlcEnum.clank]: () => getClankDeckCards(),
    };

    constructor() { }

    getSelectReserveDecks(): ClankSelectDeckValue[] {
        return Object.keys(this.reserveDecks).map((key) => {
            const id = key as ClankDlcEnum;
            return {
                id,
                name: ClankDlcName[key as ClankDlcEnum],
                value: false,
            };
        });
    }

    getReserveDecksCards(ids: ClankDlcEnum[], userCount: number) {
        return ids.flatMap((id) => this.reserveDecks[id]?.(userCount) ?? []);
    }

    getSelectStartDecks(): ClankSelectDeckValue[] {
        return Object.keys(this.startDecks).map((key) => {
            const id = key as ClankDlcEnum;
            return {
                id,
                name: ClankDlcName[key as ClankDlcEnum],
                value: false,
            };
        });
    }

    getStartDeckCards(id: ClankDlcEnum) {
        console.log(id, this.startDecks, this.startDecks[id]?.());
        return this.startDecks[id]?.() ?? [];
    }

    getSelectShareDecks(): ClankSelectDeckValue[] {
        return Object.keys(this.shareDecks).map((key) => {
            const id = key as ClankDlcEnum;
            return {
                id,
                name: ClankDlcName[key as ClankDlcEnum],
                value: false,
            };
        });
    }

    getShareDecksCards(ids: ClankDlcEnum[]) {
        return ids.flatMap((id) => this.shareDecks[id]?.() ?? []);
    }

}
