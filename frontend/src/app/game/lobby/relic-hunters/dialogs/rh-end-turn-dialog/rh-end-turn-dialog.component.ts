import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import * as lodash from 'lodash';

import { RhBenefitComponent } from '../../components/rh-benefit/rh-benefit.component';
import { RelicHuntersBenefitSettings } from '../../models/benefit';
import {
    RelicHuntersCardInfo,
    RelicHuntersCardSelectable,
} from '../../models/cards';
import { RelicHuntersGameType } from '../../models/game-type';
import { RelicHuntersPlayer } from '../../models/player';

export interface RhEndTurnDialogResult {
    value: boolean;
    selectedCards: RelicHuntersCardInfo[];
    coins: number;
}

@Component({
    selector: 'app-rh-end-turn-dialog',
    templateUrl: './rh-end-turn-dialog.component.html',
    styleUrls: ['./rh-end-turn-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhEndTurnDialogComponent implements OnInit {

    marketCards: RelicHuntersCardSelectable[] = [];
    selectedCards: RelicHuntersCardInfo[] = [];

    lowCost = 0;
    coins = 0;
    allowedCoins: RhBenefitComponent['data'] = {
        key: 'coins',
        value: 0,
        size: RelicHuntersBenefitSettings.size * 0.3,
        inlineView: false,
    };

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<RhEndTurnDialogComponent, RhEndTurnDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: {
            game: RelicHuntersGameType;
            player: RelicHuntersPlayer;
            force: boolean,
        },
    ) { }

    ngOnInit(): void {
        const marketCards = Object.values(this.data.game.marketCards).flatMap(cards => {
            return cards.map((card) => {
                const result: RelicHuntersCardSelectable = {
                    selected: false,
                    selectedIndex: 0,
                    card,
                };
                return result;
            });
        });
        const reservCards = this.data.game.reservCards.map(card => {
            const result: RelicHuntersCardSelectable = {
                selected: false,
                selectedIndex: 0,
                card,
            };
            return result;
        });
        this.marketCards = [
            ...marketCards,
            ...reservCards,
        ];
        this.lowCost = this.getLowCost();
        this.allowedCoins.value = this.data.player.benefit.coins ?? 0;
    }

    close(value: boolean) {
        if (value === false) {
            this.dialogRef.close({
                value: false,
                selectedCards: [],
                coins: 0,
            });
            return;
        }
        this.dialogRef.close({
            value: true,
            selectedCards: this.selectedCards,
            coins: this.coins,
        });
    }

    selectCard(item: RelicHuntersCardSelectable) {
        if (!item.selected) {
            this.selectedCards.push(item.card);
        } else {
            this.selectedCards = this.selectedCards.filter(p => p.id != item.card.id);
        }

        this.marketCards = this.marketCards.map((p) => {
            p.selectedIndex = this.selectedCards.findIndex(card => p.card.id === card.id);
            p.selected = p.selectedIndex != -1;
            return p;
        });

        this.lowCost = this.getLowCost();
        this.coins = lodash.sumBy(this.selectedCards, (p) => p.price ?? 0);
        const allowedCoins = this.data.player.benefit.coins ?? 0;
        this.allowedCoins = {
            ...this.allowedCoins,
            value: allowedCoins - this.coins,
        };
        this.changeDetectorRef.markForCheck();
    }

    getLowCost() {
        const priceList = this.marketCards
            .filter(p => !p.selected && p.card.price != null && p.card.price > 0)
            .map(p => p.card.price)
            .filter((p): p is number => p != null && p > 0);
        return priceList.length > 0
            ? Math.min(...priceList)
            : 0;
    }

    // Список карт в руке у пользователя и решение остаться
    // Если пользователь решил остаться, то он может купить карты на рынке

}
