import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    cardHeight,
    cardsWrapPadding,
    cardWidth,
    ISelectedPlayerCardInfo,
} from 'src/app/shared/components/clank-card/clank-card.types';
import { updateBenefitInfoByAction } from 'src/app/shared/models/actions.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import { ClankCardState } from '@shared/clank/clank-card.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { GameCardService } from '../services/game-card.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-dungeon-row',
    templateUrl: './clank-dungeon-row.component.html',
    styleUrls: ['./clank-dungeon-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankDungeonRowComponent implements OnInit {

    cardsWrapInfo = {
        rowCount: 7,
        cardWidth,
        cardHeight,
        dungeonRowTop: 0,
        reserveRowTop: cardHeight + cardsWrapPadding,
    };

    @HostBinding('style.--dungeon_width') dungeon_width = `${this.cardsWrapInfo.cardWidth}px`;
    @HostBinding('style.--dungeon_height') dungeon_height = `${this.cardsWrapInfo.cardHeight}px`;

    cardsSubject = combineLatest([
        this.data.gameInfoQuery.onDungeonDeckChangeSubject,
        this.data.gameInfoQuery.onDungeonRowChangeSubject,
        this.data.gameInfoQuery.onReserveRowChangeSubject,
    ]).pipe(
        map(([
            dungeonDeckCards,
            dungeonRowCards,
            reserveRowCards,
        ]) => {
            const dungeonDeck: ISelectedPlayerCardInfo[] = dungeonDeckCards.map((state) => {
                const data: ISelectedPlayerCardInfo = {
                    id: state.id,
                    state,
                    style: {
                        left: `0px`,
                        top: `${this.cardsWrapInfo.dungeonRowTop}px`,
                    },
                    isOpen: false,
                    classes: [],
                    actions: [],
                };
                return data;
            });
            const dungeonRow: ISelectedPlayerCardInfo[] = dungeonRowCards.map((state, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: state.id,
                    state,
                    style: {
                        left: `${(cardWidth + cardsWrapPadding) * (index + 1)}px`,
                        top: `${this.cardsWrapInfo.dungeonRowTop}px`,
                    },
                    isOpen: true,
                    classes: [],
                    actions: [{
                        name: 'Купить',
                        canUse: () => true,
                        callback: () => this.buyCard(state),
                    }],
                };
                return data;
            });
            const reserveRowGroups = new Map<string, number>();
            const reserveRow: ISelectedPlayerCardInfo[] = reserveRowCards.map((state) => {
                const [find_string] = state.id.split('__');
                const index = reserveRowGroups.get(find_string) ?? reserveRowGroups.size;
                reserveRowGroups.set(find_string, index);
                const data: ISelectedPlayerCardInfo = {
                    id: state.id,
                    state,
                    style: {
                        left: `${(cardWidth + cardsWrapPadding) * index}px`,
                        top: `${this.cardsWrapInfo.reserveRowTop}px`,
                    },
                    isOpen: true,
                    classes: [],
                    actions: [{
                        name: 'Купить',
                        canUse: () => true,
                        callback: () => this.buyCard(state),
                    }],
                };
                return data;
            });
            return [
                ...dungeonDeck,
                ...dungeonRow,
                ...reserveRow,
            ].sort((a, b) => a.state.initIndex - b.state.initIndex);
        }),
    );

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
        private gameCardService: GameCardService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
            gameInfoQuery: GameInfoQuery;
            gameInfoService: GameInfoService;
            player: ClankPlayerConfig;
        },
    ) { }

    ngOnInit(): void {
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    buyCard(cardState: ClankCardState) {
        const card = this.cardsService.getCardInfo(cardState);
        if (card == null) {
            return;
        }
        const actions = this.gameCardService.getActions({
            card,
            player: this.data.player,
            type: 'acquire',
        });
        if (!actions.length) {
            return;
        }
        const benefitInfo: ClankCostInfo = updateBenefitInfoByAction({
            player: this.data.player,
            list: actions,
        });
        this.data.gameInfoService.useCard({
            playerId: this.data.player.id,
            cardState,
            benefitInfo,
            type: 'buy',
        });
        this.changeDetectorRef.detectChanges();
    }

}
